import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/dictionary.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `添加字典`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    code: tableData.code.schema,
                    name: tableData.name.schema,
                    value: tableData.value.schema,
                    type: tableData.type.schema,
                    describe: tableData.describe.schema,
                    content: tableData.content.schema
                },
                required: ['code', 'name', 'value', 'type']
            }
        },

        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                if (req.body.type === 'number') {
                    if (Number.isNaN(Number(req.body.value)) === true) {
                        return { ...constantConfig.code.UPDATE_FAIL, msg: '字典值不是一个数字类型' };
                    }
                }
                let dictionaryModel = fastify.mysql //
                    .table('dictionary')
                    .modify(function (queryBuilder) {});

                let data = {
                    code: req.body.code,
                    name: req.body.name,
                    value: req.body.value,
                    type: req.body.type,
                    describe: req.body.describe,
                    content: req.body.content,
                    created_at: utils.getTimestamp(),
                    updated_at: utils.getTimestamp()
                };
                let result = await dictionaryModel.insert(utils.clearEmptyData(data));
                return {
                    ...constantConfig.code.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.INSERT_FAIL;
            }
        }
    });
}
