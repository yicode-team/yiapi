import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as noticeTable from '../../tables/notice.js';

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
                    id: noticeTable.data.id.schema,
                    title: noticeTable.data.title.schema,
                    summary: noticeTable.data.summary.schema,
                    thumbnail: noticeTable.data.thumbnail.schema,
                    is_recommend: noticeTable.data.is_recommend.schema,
                    content: noticeTable.data.content.schema
                },
                required: ['id']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let noticeModel = fastify.mysql //
                    .table('notice')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let data = {
                    title: req.body.title,
                    summary: req.body.summary,
                    thumbnail: req.body.thumbnail,
                    content: req.body.content,
                    is_recommend: req.body.is_recommend,
                    updated_at: utils.getTimestamp()
                };

                let result = await noticeModel.update(utils.clearEmptyData(data));

                return {
                    ...constantConfig.code.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
