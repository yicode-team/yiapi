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
            summary: `查询所有通知`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    keywords: schemaConfig.keywords
                }
            }
        },
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let noticeModel = fastify.mysql.table('notice');

                let rows = await noticeModel.clone().select();

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
