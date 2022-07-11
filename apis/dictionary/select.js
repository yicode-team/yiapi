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
            summary: `查询字典`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    category: dictionaryTable.data.category.schema,
                    page: schemaConfig.page,
                    limit: schemaConfig.limit,
                    keywords: schemaConfig.keywords
                },
                required: ['category']
            }
        },
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let dictionaryModel = fastify.mysql //
                    .table('dictionary')
                    .where('category', req.body.category)
                    .modify(function (queryBuilder) {
                        if (req.body.keywords !== undefined) {
                            queryBuilder.where('name', 'like', `%${req.body.keywords}%`);
                        }
                    });

                let { count } = await dictionaryModel
                    //
                    .clone()
                    .count('id', { as: 'count' })
                    .first();

                let resultData = await dictionaryModel
                    //
                    .clone()
                    .offset(utils.getOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

                // 处理数字符号强制转换为数字值
                let rows = resultData.map((item) => {
                    if (item.symbol === 'number') {
                        item.value = Number(item.value);
                    }
                    return item;
                });

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: {
                        count: count,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
