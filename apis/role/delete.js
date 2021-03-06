import * as _ from 'lodash-es';
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
            summary: `删除角色`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: roleTable.data.id.schema
                },
                required: ['id']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let roleModel = fastify.mysql //
                    .table('role')
                    .modify(function (queryBuilder) {});

                let selectResult = await roleModel.clone().where('pid', req.body.id).first();
                if (selectResult !== undefined) {
                    return _.merge(constantConfig.code.FAIL, { msg: '该权限存在下级权限，无法删除' });
                }

                let result = await roleModel.clone().where({ id: req.body.id }).delete();

                await fastify.cacheRoleData();

                return {
                    ...constantConfig.code.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                return constantConfig.code.DELETE_FAIL;
            }
        }
    });
}
