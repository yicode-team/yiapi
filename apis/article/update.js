import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as articleTable from '../../tables/article.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `更新文章`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: articleTable.data.id.schema,
                    title: articleTable.data.title.schema,
                    describe: articleTable.data.describe.schema,
                    is_recommend: articleTable.data.is_recommend.schema,
                    content: articleTable.data.content.schema
                },
                required: ['id']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let articleModel = fastify.mysql //
                    .table('article')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let data = {
                    title: req.body.title,
                    describe: req.body.describe,
                    content: req.body.content,
                    is_recommend: req.body.is_recommend,
                    updated_at: utils.getTimestamp()
                };

                let result = await articleModel.update(utils.clearEmptyData(data));

                return {
                    ...constantConfig.code.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
