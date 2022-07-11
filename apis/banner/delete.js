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
            summary: `删除轮播图`,
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: bannerTable.data.id.schema
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

                let result = await bannerModel.delete();
                return constantConfig.code.INSERT_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.INSERT_FAIL;
            }
        }
    });
}
