// 初始化用到的菜单配置，请勿改动
import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'dictionary.js'));
let importConfig = await utils.importNew(apiRelativePath, []);

const dictionaryConfig = _.concat(
    [
        {
            name: '目录分类',
            value: 'treeCategory',
            describe: '目录分类字典',
            code: 'root',
            children: [
                {
                    name: '菜单',
                    value: 'menu',
                    code: 'treeCategory'
                },
                {
                    name: '接口',
                    value: 'api',
                    code: 'treeCategory'
                }
            ]
        }
    ],
    importConfig.dictionaryConfig
);

export { dictionaryConfig };
