import fp from 'fastify-plugin';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { dictionaryConfig } from '../config/dictionary.js';

// 同步字典目录
async function syncDictionary(fastify) {
    // 准备好表
    let model = fastify.mysql.table('dictionary');

    // 第一次请求菜单数据，用于创建一级菜单
    let dictionaryData = await model.clone().where('code', 'treeCategory').orWhere('code', 'root').select();
    let dictionaryObject = _.uniq(dictionaryData.map((item) => item.code));

    let dictionaryConfigFlat = [];
    dictionaryConfig.map((item) => {
        dictionaryConfigFlat.push(_.omit(item, ['children']));
        item.children.forEach((item2) => {
            dictionaryConfigFlat.push(item2);
        });
    });

    // 将要添加的接口数据
    let insertDictionaryDir = [];
    _.forEach(dictionaryConfigFlat, (item, index) => {
        if (dictionaryObject.includes(item.code) === false) {
            insertDictionaryDir.push({
                type: 'string',
                name: item.name,
                value: item.value,
                code: item.code,
                sort: index,
                describe: item.describe || '',
                content: item.content || '',
                created_at: utils.getDatetime(),
                updated_at: utils.getDatetime()
            });
        }
    });

    if (_.isEmpty(insertDictionaryDir) === false) {
        await model.clone().insert(insertDictionaryDir);
    }
}

async function plugin(fastify) {
    // 同步接口
    try {
        await syncDictionary(fastify);
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'syncDictionary', dependencies: ['mysql', 'sequelize', 'redis', 'tool'] });
