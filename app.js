import path from 'path';
import fs from 'fs-extra';
import Fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import fp from 'fastify-plugin';
import localize from 'ajv-i18n';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import * as sequelize from 'sequelize';
import * as _ from 'lodash-es';
import fg from 'fast-glob';

// 工具函数
import * as utils from './utils/index.js';

// 配置信息
import { appConfig } from './config/app.js';
import { loggerConfig } from './config/logger.js';
import { constantConfig } from './config/constant.js';
import { schemaConfig } from './config/schema.js';
import { apiConfig } from './config/api.js';
import { menuConfig } from './config/menu.js';
import { roleConfig } from './config/role.js';
import { databaseConfig } from './config/database.js';
import { systemConfig } from './system.js';

// 表同步
import { syncDatabase } from './sync/database.js';

// 表定义
import * as adminTable from './tables/admin.js';
import * as articleTable from './tables/article.js';
import * as bannerTable from './tables/banner.js';
import * as dictionaryTable from './tables/dictionary.js';
import * as feedbackTable from './tables/feedback.js';
import * as noticeTable from './tables/notice.js';
import * as roleTable from './tables/role.js';
import * as treeTable from './tables/tree.js';
import * as userTable from './tables/user.js';

// 初始化项目结构
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'addons'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'apis'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'plugins'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'tables'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'config'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'utils'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'yiapi.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'api.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'app.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'cors.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'constant.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'dictionary.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'database.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'menu.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'redis.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'role.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'schema.js'));

const fastify = Fastify({
    logger: loggerConfig,
    pluginTimeout: 0,
    genReqId: () => nanoid(),
    ajv: {
        customOptions: {
            allErrors: true,
            verbose: true
        }
    }
});

// 处理全局错误
fastify.setErrorHandler(function (error, req, res) {
    if (error.validation) {
        localize.zh(error.validation);
        let msg = error.validation
            .map((error) => {
                return (error.parentSchema.title + ' ' + error.message).trim();
            })
            .join(',');
        res.status(200).send({ code: 1, msg: msg, symbol: 'GLOBAL_ERROR' });
        return;
    }

    if (error.statusCode >= 500) {
        fastify.log.error(error);
        // 发送错误响应
    } else if (error.statusCode >= 400) {
        fastify.log.info(error);
    } else {
        fastify.log.warn(error);
    }

    // 发送错误响应
    res.status(200).send({ code: 1, msg: error.message, symbol: 'GLOBAL_ERROR' });
});

// 处理未找到路由
fastify.setNotFoundHandler(function (req, res) {
    // 发送错误响应
    res.status(200).send({ code: 1, msg: '未知路由', data: req.url });
});

fastify.get('/', function (req, res) {
    res.send({ code: 0, msg: '接口程序已启动' });
});

// 路由映射列表
fastify.register(autoLoad, {
    dir: path.join(systemConfig.yiapiDir, 'plugins', 'routes'),
    indexPattern: /routes\.js/
});

// 接口文档生成
fastify.register(autoLoad, {
    dir: path.join(systemConfig.yiapiDir, 'plugins', 'swagger'),
    indexPattern: /swagger\.js/
});

// 加载启动插件
fastify.register(autoLoad, {
    dir: path.join(systemConfig.yiapiDir, 'bootstrap'),
    ignorePattern: /^_/
});

// 加载系统接口
fastify.register(autoLoad, {
    dir: path.join(systemConfig.yiapiDir, 'apis'),
    ignorePattern: /^_/
});

// 加载用户接口
fastify.register(autoLoad, {
    dir: path.join(systemConfig.appDir, 'apis'),
    ignorePattern: /^_/
});

// 加载三方接口
let thirdApiFiles = fg.sync('./addons/*/apis/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });
let prefixEnum = {};
for (let i = 0; i < thirdApiFiles.length; i++) {
    let file = thirdApiFiles[i];
    let prefix = path.basename(path.dirname(path.dirname(file)));
    prefixEnum[prefix] = path.dirname(file);
}

_.forOwn(prefixEnum, (apis, prefix) => {
    fastify.register(autoLoad, {
        dir: apis,
        ignorePattern: /^_/,
        options: { prefix: prefix }
    });
});

// 加载用户插件
fastify.register(autoLoad, {
    dir: path.join(systemConfig.appDir, 'plugins'),
    ignorePattern: /^_/
});

// 加载三方插件
let thirdPluginsFiles = fg.sync('./addons/*/plugins/*', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });

thirdPluginsFiles.forEach((file) => {
    fastify.register(autoLoad, {
        dir: path.dirname(file),
        ignorePattern: /^_/
    });
});

function yiApi() {
    return new Promise(async (resolve, reject) => {
        // 启动服务！
        fastify.listen({ port: appConfig.port }, async function (err, address) {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            await fastify.cacheTreeData();
            await fastify.cacheRoleData();
            fastify.log.info(`接口服务已启动： ${address}`);
            console.log(`接口服务已启动： ${address}`);
        });

        fastify.ready((err) => {
            if (err) {
                throw err;
            } else {
                return resolve(fastify);
            }
        });
    });
}

export {
    //
    _,
    fastify,
    yiApi,
    utils,
    fp,
    fs,
    dayjs,
    nanoid,
    sequelize,
    constantConfig,
    schemaConfig,
    systemConfig,
    appConfig,
    apiConfig,
    menuConfig,
    roleConfig,
    databaseConfig,
    syncDatabase,
    adminTable,
    articleTable,
    bannerTable,
    dictionaryTable,
    feedbackTable,
    noticeTable,
    roleTable,
    treeTable,
    userTable
};
