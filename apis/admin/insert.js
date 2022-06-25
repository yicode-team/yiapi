import { nanoid } from 'nanoid';
import * as _ from 'lodash-es';
import md5 from 'blueimp-md5';

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
            summary: `添加管理员`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    username: adminTable.data.username.schema,
                    password: adminTable.data.password.schema,
                    nickname: adminTable.data.nickname.schema,
                    role_codes: adminTable.data.role_codes.schema
                },
                required: ['username', 'password', 'nickname', 'role_codes']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql.table('admin');
                let adminExistsData = await adminModel.clone().where('username', req.body.username).first();
                if (adminExistsData) {
                    return {
                        ...constantConfig.code.FAIL,
                        msg: '管理员账号或昵称已存在'
                    };
                }

                let insertData = {
                    username: req.body.username,
                    password: utils.MD5(md5(req.body.password)),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes,
                    uuid: utils.RandomHASH(),
                    created_at: utils.getTimestamp(),
                    updated_at: utils.getTimestamp()
                };

                let result = await adminModel.clone().insert(utils.clearEmptyData(insertData));
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
