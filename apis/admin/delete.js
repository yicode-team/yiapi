import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as adminTable from '../../tables/admin.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            tags: [apiInfo.parentDirName],
            summary: `删除管理员`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: adminTable.data.id.schema
                },
                required: ['id']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql //
                    .table('admin')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let result = await adminModel.delete();

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
