import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as bannerTable from '../../tables/banner.js';

const apiInfo = utils.getApiInfo(import.meta.url);
export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `查询轮播图`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    page: schemaConfig.page,
                    limit: schemaConfig.limit,
                    is_recommend: bannerTable.data.is_recommend.schema
                }
            }
        },
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let bannerModel = fastify.mysql //
                    .table('banner')
                    .modify(function (queryBuilder) {
                        if (req.body.is_recommend !== undefined) {
                            queryBuilder.where('is_recommend', req.body.is_recommend);
                        }
                    });

                let { count } = await bannerModel //
                    .clone()
                    .count('id', { as: 'count' })
                    .first();

                let rows = await bannerModel //
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
                fastify.logError(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
