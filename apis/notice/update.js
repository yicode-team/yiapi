import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/notice.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `更新通知`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: tableData.id.schema,
                    title: tableData.title.schema,
                    summary: tableData.summary.schema,
                    is_recommend: tableData.is_recommend.schema,
                    content: tableData.content.schema
                },
                required: ['id']
            }
        },

        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let data = {
                    title: req.body.title,
                    summary: req.body.summary,
                    content: req.body.content,
                    is_recommend: req.body.is_recommend,
                    updated_at: utils.getTimestamp()
                };

                let result = await model.update(utils.clearEmptyData(data));

                return {
                    ...constantConfig.code.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
