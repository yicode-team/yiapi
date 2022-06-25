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
            summary: `添加角色`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    code: roleTable.data.code.schema,
                    name: roleTable.data.name.schema,
                    describe: roleTable.data.describe.schema,
                    menu_ids: roleTable.data.menu_ids.schema
                },
                required: ['name', 'code']
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
                let _result = await roleModel.clone().where('name', req.body.name).first();
                if (_result !== undefined) {
                    return _.merge(constantConfig.code.FAIL, { msg: '角色已存在' });
                }

                let data = {
                    code: req.body.code,
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids,
                    created_at: utils.getTimestamp(),
                    updated_at: utils.getTimestamp()
                };
                let result = await roleModel.clone().insert(utils.clearEmptyData(data));

                await fastify.cacheRoleData();

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
