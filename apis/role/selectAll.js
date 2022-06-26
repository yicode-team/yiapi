import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as roleTable from '../../tables/role.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `查询所有角色`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {}
            }
        },
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let roleModel = fastify.mysql //
                    .table('role')
                    .modify(function (queryBuilder) {
                        if (utils.existsRole(req.session, 'dev') === false) {
                            queryBuilder.where('code', '<>', 'dev');
                        }
                    });

                let rows = await roleModel.clone().select();

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
