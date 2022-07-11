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
            summary: `添加意见反馈`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    content: feedbackTable.data.content.schema
                },
                required: ['content']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let feedbackModel = fastify.mysql //
                    .table('feedback')
                    .modify(function (queryBuilder) {});

                let data = {
                    user_id: req.session.id,
                    content: req.body.content,
                    created_at: utils.getTimestamp(),
                    updated_at: utils.getTimestamp()
                };

                let result = await feedbackModel.insert(utils.clearEmptyData(data));
                return {
                    ...constantConfig.code.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.INSERT_FAIL;
            }
        }
    });
}
