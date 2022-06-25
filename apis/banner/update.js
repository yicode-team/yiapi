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
            summary: `更新轮播图`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: schemaConfig.id,
                    link: bannerTable.data.link.schema,
                    thumbnail: bannerTable.data.thumbnail.schema,
                    is_recommend: bannerTable.data.is_recommend.schema
                },
                required: ['id']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let bannerModel = fastify.mysql //
                    .table('banner')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                // 需要更新的数据
                let data = {
                    title: req.body.title,
                    link: req.body.link,
                    thumbnail: req.body.thumbnail,
                    is_recommend: req.body.is_recommend,
                    updated_at: utils.getTimestamp()
                };

                let result = await bannerModel.update(utils.clearEmptyData(data));
                return constantConfig.code.UPDATE_SUCCESS;
            } catch (err) {
                fastify.logError(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
