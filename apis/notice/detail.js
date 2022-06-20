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
            summary: `查询通知详情`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: schemaConfig.id
                },
                required: ['id']
            }
        },
        handler: async function (req, res) {
            try {
                let modelNotice = fastify.mysql //
                    .table('notice');

                let result = await modelNotice //
                    .clone()
                    .where({ id: req.body.id })
                    .first();

                return {
                    ...constantConfig.code.SUCCESS_SELECT,
                    data: result
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.FAIL_SELECT;
            }
        }
    });
}
