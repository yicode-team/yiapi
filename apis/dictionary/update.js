import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as dictionaryTable from '../../tables/dictionary.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `更新字典`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: dictionaryTable.data.id.schema,
                    category: dictionaryTable.data.category.schema,
                    code: dictionaryTable.data.code.schema,
                    name: dictionaryTable.data.name.schema,
                    value: dictionaryTable.data.value.schema,
                    symbol: dictionaryTable.data.symbol.schema,
                    thumbnail: dictionaryTable.data.thumbnail.schema,
                    images: dictionaryTable.data.images.schema,
                    describe: dictionaryTable.data.describe.schema,
                    content: dictionaryTable.data.content.schema
                },
                required: ['id']
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
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let data = {
                    category: req.body.category,
                    code: req.body.code,
                    name: req.body.name,
                    value: req.body.value,
                    symbol: req.body.symbol,
                    thumbnail: req.body.thumbnail,
                    images: req.body.images,
                    describe: req.body.describe,
                    content: req.body.content,
                    updated_at: utils.getTimestamp()
                };
                let result = await dictionaryModel.update(utils.clearEmptyData(data));
                return constantConfig.code.UPDATE_SUCCESS;
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
