// 模块
import path from 'path';
import * as _ from 'lodash-es';
import { Sequelize, DataTypes } from 'sequelize';
import fg from 'fast-glob';
import cliProgress from 'cli-progress';

// 内部
import * as utils from '../utils/index.js';
import { appConfig } from '../config/app.js';
import { databaseConfig } from '../config/database.js';
import { systemConfig } from '../system.js';

function syncDatabase(options = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('数据库连接中...');
            const sequelize = await new Sequelize(databaseConfig.db, databaseConfig.username, databaseConfig.password, {
                host: databaseConfig.host,
                dialect: databaseConfig.dialect,
                port: databaseConfig.port,
                define: {
                    underscored: true,
                    freezeTableName: true,
                    charset: 'utf8mb4',
                    dialectOptions: {
                        collate: 'utf8mb4_general_ci'
                    },
                    timestamps: false
                },
                omitNull: false,
                logQueryParameters: false,
                clientMinMessages: false,
                logging: () => {}
            });

            console.log('数据库已连接...');
            console.log('数据库认证中...');

            console.log('数据库已认证...');

            console.log('获取核心表结构...');
            let coreTableFiles = fg.sync('./tables/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.yiapiDir });
            console.log('获取用户表结构...');
            let appTableFiles = fg.sync('./tables/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });
            console.log('获取插件表结构...');
            let thirdTableFiles = fg.sync('./addons/*/tables/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });

            let allTableFiles = _.concat(coreTableFiles, appTableFiles, thirdTableFiles);

            // 所有合并的表数据
            let allTableMerge = {};
            let stepNumber = 1;
            console.log('开始表同步...');
            console.log('-------------------------------------');

            // 合并表参数
            for (let i = 0; i < allTableFiles.length; i++) {
                let file = allTableFiles[i];
                let tableRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(file));
                let { describe, name, data, option } = await utils.importNew(tableRelativePath, {});

                if (name) {
                    // 将当前表数据添加到合并中
                    allTableMerge[name] = {
                        describe: describe,
                        name: name,
                        data: allTableMerge[name] ? _.merge(allTableMerge[name].data, data) : data,
                        option: option
                    };
                } else {
                    console.log(`[未识别表] - ${tableRelativePath}`);
                }
            }

            let allTableLength = _.size(allTableMerge);

            // 开始进行表同步
            for (let prop in allTableMerge) {
                let { describe, name, data, option } = allTableMerge[prop];

                let schema = {
                    id: utils.tableField('自增', 'id').table,
                    created_at: utils.tableField('创建时间', 'intMin0').table,
                    updated_at: utils.tableField('更新时间', 'intMin0').table,
                    deleted_at: utils.tableField('删除时间', 'intMin0').table
                };
                _.forOwn(data, (item, key) => {
                    schema[key] = item.table;
                });
                let table = await sequelize.define(name, schema, option);

                let syncParams = {
                    logging: false,
                    alter: true,
                    force: false
                };

                let group = `${name} (${option.comment})`;

                let count = await table.count();
                if (count < 10000) {
                    table
                        .sync(syncParams)
                        .then((res) => {
                            console.log(`[ ${_.padStart(stepNumber++, 2, '00')} / ${allTableLength} ] - 已同步: ${group}`);
                            if (stepNumber > allTableLength) {
                                console.log('-------------------------------------');
                                console.log('表结构已全部同步完毕，请勿操作，耐心等待程序结束...');
                            }
                        })
                        .catch((err) => {
                            console.log('🚀 ~ file: database.js ~ line 78 ~ syncDatabase ~ err', err);
                            reject(err);
                        });
                } else {
                    console.log(`[ ${_.padStart(stepNumber++, 2, '00')} / ${allTableLength} ] - 未同步: ${group}，数据大于1000条，请手动修改数据表结构`);
                }
            }
        } catch (err) {
            console.log('🚀 ~ file: database.js ~ line 89 ~ syncDatabase ~ err', err);
            reject(err);
        }
    });
}
export { syncDatabase };
