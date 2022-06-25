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
            summary: `更新管理员`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: adminTable.data.id.schema,
                    password: adminTable.data.password.schema,
                    nickname: adminTable.data.nickname.schema,
                    role_codes: adminTable.data.role_codes.schema
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

                // 需要更新的数据
                let data = {
                    password: utils.MD5(req.body.password),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes,
                    updated_at: utils.getTimestamp()
                };

                let updateResult = await adminModel.update(utils.clearEmptyData(data));

                return constantConfig.code.UPDATE_SUCCESS;
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
