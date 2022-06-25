import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as bannerTable from '../../tables/banner.js';

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
                    title: bannerTable.data.title.schema,
                    link: bannerTable.data.link.schema,
                    thumbnail: bannerTable.data.thumbnail.schema,
                    is_recommend: bannerTable.data.is_recommend.schema
                },
                required: ['title', 'thumbnail']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let bannerModel = fastify.mysql //
                    .table('banner')
                    .modify(function (queryBuilder) {});

                let data = {
                    title: req.body.title,
                    link: req.body.link,
                    thumbnail: req.body.thumbnail,
                    is_recommend: req.body.is_recommend,
                    created_at: utils.getTimestamp(),
                    updated_at: utils.getTimestamp()
                };
                let result = await bannerModel.insert(utils.clearEmptyData(data));

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
