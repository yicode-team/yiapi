import { fn_getFileInfos, fn_getOffset } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import noticeTable from '../../tables/notice.js';

const fileInfos = fn_getFileInfos(import.meta.url);
export default async function (fastify, opts) {
    fastify.route({
        method: 'GET',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            query: {
                type: 'object',
                properties: {
                    page: schema.page,
                    limit: schema.limit,
                    keywords: schema.keywords
                }
            }
        },
        config: {},
        handler: async function (req, res) {
            let model = fastify.mysql //
                .table('notice')
                .modify(function (queryBuilder) {
                    if (req.query.keywords) {
                        queryBuilder.where('title', 'like', `%${req.query.keywords}%`);
                    }
                });

            let resultCount = await model.clone().count('id', { as: 'count' }).first();
            let resultRows = await model.clone().offset(fn_getOffset(req.query.page, req.query.limit)).limit(req.query.limit).select();
            return {
                ...constant.code.SUCCESS_SELECT,
                data: {
                    count: resultCount.count,
                    rows: resultRows,
                    page: req.query.page,
                    limit: req.query.limit
                }
            };
        }
    });
}
