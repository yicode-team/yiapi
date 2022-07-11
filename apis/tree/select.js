import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as treeTable from '../../tables/tree.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `查询树`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    category: treeTable.data.category.schema,
                    page: schemaConfig.page,
                    limit: schemaConfig.limit
                },
                required: ['category']
            }
        },
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table('tree')
                    .where('category', req.body.category)
                    .modify(function (queryBuilder) {});

                let { count } = await model.clone().count('id', { as: 'count' }).first();
                let rows = await model
                    //
                    .clone()
                    .offset(utils.getOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

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
