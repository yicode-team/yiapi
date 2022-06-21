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

async function syncDatabase(options = {}) {
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
                timestamps: false,
                createdAt: 'created_at',
                updatedAt: 'updated_at',
                deletedAt: 'deleted_at'
            },
            omitNull: false
        });

        console.log('数据库已连接...');
        console.log('数据库认证中...');

        await sequelize.authenticate();
        console.log('数据库已认证...');

        console.log('获取核心表结构...');
        let coreTableFiles = fg.sync('./tables/**/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.yiapiDir });
        console.log('获取用户表结构...');
        let appTableFiles = fg.sync('./tables/**/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });
        console.log('获取插件表结构...');
        let thirdTableFiles = fg.sync('./addons/*/tables/**/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });

        let allTableFiles = _.concat(coreTableFiles, appTableFiles, thirdTableFiles);
        let allTableLength = allTableFiles.length;
        let stepNumber = 1;
        console.log('开始表同步...');
        for (let i = 0; i < allTableFiles.length; i++) {
            let file = allTableFiles[i];
            let tableRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(file));
            let { tableDescribe, tableName, tableData, tableOption } = await utils.importNew(tableRelativePath, {});
            if (tableName) {
                let tableSchema = {
                    created_at: {
                        type: DataTypes.BIGINT,
                        allowNull: false,
                        defaultValue: 0,
                        comment: '创建时间'
                    },
                    updated_at: {
                        type: DataTypes.BIGINT,
                        allowNull: false,
                        defaultValue: 0,
                        comment: '更新时间'
                    },
                    deleted_at: {
                        type: DataTypes.BIGINT,
                        allowNull: false,
                        defaultValue: 0,
                        comment: '删除时间'
                    }
                };
                _.forOwn(tableData, (item, key) => {
                    tableSchema[key] = item.table;
                });
                let table = await sequelize.define(tableName, tableSchema, tableOption);
                let syncParams = {
                    logging: false,
                    alter: true
                };
                // if (options.force === true) {
                //     syncParams.force = true;
                // } else {
                //     syncParams.alter = false;
                // }
                table
                    .sync(syncParams)
                    .then((res) => {
                        console.log(`[ ${stepNumber++} / ${allTableLength} ] - ${tableName} 表同步完毕`);
                        if (stepNumber > allTableLength) {
                            console.log('表结构已全部同步完毕，请勿操作，耐心等待程序结束...');
                        }
                    })
                    .catch((err) => {
                        console.log('🚀 ~ file: database.js ~ line 78 ~ syncDatabase ~ err', err);
                    });
            }
        }
    } catch (err) {
        console.log('🚀 ~ file: database.js ~ line 89 ~ syncDatabase ~ err', err);
    }
}
export { syncDatabase };
