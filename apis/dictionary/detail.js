import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as dictionaryTable from '../../tables/dictionary.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `查询字典`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    value: dictionaryTable.data.value.schema
                },
                required: ['value']
            }
        },
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let dictionaryModel = fastify.mysql.table('dictionary');

                let result = await dictionaryModel //
                    .clone()
                    .where('value', req.body.value)
                    .first();

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
