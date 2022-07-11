import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as feedbackTable from '../../tables/feedback.js';

const apiInfo = utils.getApiInfo(import.meta.url);
export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `更新意见反馈`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    page: schemaConfig.page,
                    limit: schemaConfig.limit,
                    keywords: schemaConfig.keywords
                }
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let feedbackModel = fastify.mysql //
                    .table('feedback')
                    .leftJoin('user', 'feedback.user_id', 'user.id')
                    .modify(function (queryBuilder) {});

                let resultCount = await feedbackModel.clone().count('*', { as: 'count' }).first();
                let rows = await feedbackModel //
                    .clone()
                    .offset(utils.getOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select('feedback.*', 'user.nickname', 'user.username', 'user.phone');
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
                fastify.log.error(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
