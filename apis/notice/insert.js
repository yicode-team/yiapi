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
            summary: `添加通知`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    title: tableData.title.schema,
                    summary: tableData.summary.schema,
                    is_recommend: tableData.is_recommend.schema,
                    content: tableData.content.schema
                },
                required: ['title']
            }
        },

        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .modify(function (queryBuilder) {});

                let data = {
                    publisher_id: req.user.id,
                    publisher_nickname: req.user.nickname,
                    title: req.body.title,
                    summary: req.body.summary,
                    content: req.body.content,
                    is_recommend: req.body.is_recommend,
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
