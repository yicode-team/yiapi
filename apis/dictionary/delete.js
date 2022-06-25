import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/dictionary.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `删除字典`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: tableData.id.schema
                },
                required: ['id']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let dictionaryModel = fastify.mysql //
                    .table('dictionary')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let result = await dictionaryModel.delete();
                return constantConfig.code.DELETE_SUCCESS;
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.DELETE_FAIL;
            }
        }
    });
}
