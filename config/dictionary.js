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
            value: '',
            describe: '目录分类字典',
            category: 'root',
            code: 'treeCategory',
            children: [
                {
                    name: '菜单',
                    value: '',
                    code: 'menu'
                },
                {
                    name: '接口',
                    value: '',
                    code: 'api'
                }
            ]
        }
    ],
    importConfig.dictionaryConfig
);

export { dictionaryConfig };
