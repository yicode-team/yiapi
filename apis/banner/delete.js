import { fn_getFileInfos } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import bannerTable from '../../tables/banner.js';

const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: bannerTable.id.schema
                },
                required: ['id']
            }
        },
        config: {},
        handler: async function (req, res) {
            let model = fastify.mysql //
                .table('banner')
                .where({ id: req.body.id })
                .modify(function (queryBuilder) {});

            let result = await model.delete();
            if (!result) {
                return constant.code.FAIL_INSERT;
            }
            return constant.code.SUCCESS_INSERT;
        }
    });
}
