import * as utils from '../../utils/index.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import * as treeTable from '../../tables/tree.js';

const apiInfo = utils.getApiInfo(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: `查询所有树`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    category: treeTable.data.category.schema
                },
                required: ['category']
            }
        },
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                // TODO: 优化，不同分类的目录独立的缓存
                let treeData = await fastify.redisGet('cacheData:tree', 'json');
                let rows = treeData.filter((item) => item.category === req.body.category);
                // let model = fastify.mysql //
                //     .table('tree')
                //     .where('type', req.body.type)
                //     .modify(function (queryBuilder) {});

                // let rows = await model.clone().orderBy('sort', 'asc').select();

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
