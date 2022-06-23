import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/feedback.js';

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
                    content: tableData.content.schema
                },
                required: ['content']
            }
        },
        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .modify(function (queryBuilder) {});

                let data = {
                    user_id: req.user.id,
                    content: req.body.content,
                    created_at: utils.getTimestamp(),
                    updated_at: utils.getTimestamp()
                };

                let result = await model.insert(utils.clearEmptyData(data));
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
