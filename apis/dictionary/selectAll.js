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
            summary: `查询所有字典`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    code: tableData.code.schema,
                    keywords: schemaConfig.keywords
                }
            }
        },
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let dictionaryModel = fastify.mysql.table('dictionary').where('code', req.body.code);
                let resultData = await dictionaryModel.clone().select();

                let rows = resultData.map((item) => {
                    if (item.type === 'number') {
                        item.value = Number(item.value);
                    }
                    return item;
                });
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
