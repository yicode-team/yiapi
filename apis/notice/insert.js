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
            summary: `添加通知`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    title: noticeTable.data.title.schema,
                    summary: noticeTable.data.summary.schema,
                    thumbnail: noticeTable.data.thumbnail.schema,
                    is_recommend: noticeTable.data.is_recommend.schema,
                    content: noticeTable.data.content.schema
                },
                required: ['title', 'summary']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let noticeModel = fastify.mysql //
                    .table('notice')
                    .modify(function (queryBuilder) {});

                let data = {
                    publisher_id: req.session.id,
                    publisher_nickname: req.session.nickname,
                    title: req.body.title,
                    summary: req.body.summary,
                    thumbnail: req.body.thumbnail,
                    content: req.body.content,
                    is_recommend: req.body.is_recommend,
                    created_at: utils.getTimestamp(),
                    updated_at: utils.getTimestamp()
                };

                let result = await noticeModel.insert(utils.clearEmptyData(data));
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
