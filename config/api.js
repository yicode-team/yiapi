// 初始化接口分类
import path from 'path';
import * as _ from 'lodash-es';
import fg from 'fast-glob';

import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

// 用户接口配置
let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'api.js'));
let importConfig = await utils.importNew(apiRelativePath, []);

// 三方接口配置
let addonsApiFiles = fg.sync('addons/*/config/api.js', { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });
let assonsApiConfig = [];

for (let i = 0; i < addonsApiFiles.length; i++) {
    let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), addonsApiFiles[i]);
    let importConfig = await utils.importNew(apiRelativePath, []);
    assonsApiConfig = _.concat(assonsApiConfig, importConfig.apiConfig);
}

const apiConfig = _.concat(
    [
        {
            name: '目录',
            value: '/tree'
        },
        {
            name: '角色',
            value: '/role'
        },
        {
            name: '管理员',
            value: '/admin'
        },
        {
            name: '轮播',
            value: '/banner'
        },
        {
            name: '反馈',
            value: '/feedback'
        },
        {
            name: '通知',
            value: '/notice'
        },
        {
            name: '文章',
            value: '/article'
        },
        {
            name: '字典',
            value: '/dictionary'
        }
    ],
    importConfig.apiConfig,
    assonsApiConfig
);

export { apiConfig };
