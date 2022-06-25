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
                    type: treeTable.data.type.schema,
                    page: schemaConfig.page,
                    limit: schemaConfig.limit
                },
                required: ['type']
            }
        },
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table('tree')
                    .where('type', req.body.type)
                    .modify(function (queryBuilder) {});

                let resultCount = await model.clone().count('id', { as: 'count' }).first();
                let rows = await model
                    //
                    .clone()
                    .offset(utils.getOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: {
                        count: resultCount.count,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
