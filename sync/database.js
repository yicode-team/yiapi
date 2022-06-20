// 模块
import path from 'path';
import * as _ from 'lodash-es';
import { Sequelize } from 'sequelize';
import fg from 'fast-glob';

// 内部
import * as utils from '../utils/index.js';
import { appConfig } from '../config/app.js';
import { databaseConfig } from '../config/database.js';
import { systemConfig } from '../system.js';

async function syncDatabase(fastify, options, done) {
    try {
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

        // 获取表文件
        let coreTableFiles = fg.sync('./tables/**/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.yiapiDir });
        let appTableFiles = fg.sync('./tables/**/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });
        let thirdTableFiles = fg.sync('./addons/*/tables/**/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });

        let allTableFiles = _.concat(coreTableFiles, appTableFiles, thirdTableFiles);

        for (let i = 0; i < allTableFiles.length; i++) {
            let file = allTableFiles[i];
            let tableRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(file));
            let { tableDescribe, tableName, tableData, tableOption } = await utils.importNew(tableRelativePath, {});
            if (tableName) {
                let tableSchema = {};
                _.forOwn(tableData, (item, key) => {
                    tableSchema[key] = item.table;
                });
                let table = await sequelize.define(tableName, tableSchema, tableOption);
                await table.sync({
                    //
                    // force: true,
                    alter: true,
                    logging: false
                });
            }
        }

        await sequelize.authenticate();
        console.log('数据同步完毕');
    } catch (err) {
        fastify.log.error(err);
    }
}
export { syncDatabase };
