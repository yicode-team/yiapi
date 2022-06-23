import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { tableDescribe, tableName, tableData } from '../../tables/banner.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            tags: [apiInfo.parentDirName],
            summary: `添加轮播图`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    title: tableData.title.schema,
                    link: tableData.link.schema,
                    thumbnail: tableData.thumbnail.schema,
                    is_recommend: tableData.is_recommend.schema
                },
                required: ['title', 'thumbnail']
            }
        },

        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(tableName)
                    .modify(function (queryBuilder) {});

                let data = {
                    title: req.body.title,
                    link: req.body.link,
                    thumbnail: req.body.thumbnail,
                    is_recommend: req.body.is_recommend,
                    created_at: utils.getTimestamp(),
                    updated_at: utils.getTimestamp()
                };
                let result = await model.insert(utils.clearEmptyData(data));

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
