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
            summary: `更新通知浏览量`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: noticeTable.data.id.schema
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
                    .where({ id: req.body.id });

                let result = await noticeModel.increment({ views: 1 });

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
