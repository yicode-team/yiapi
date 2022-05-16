import { random as _random, merge as _merge } from 'lodash-es';
import { nanoid } from 'nanoid';
import { fn_getFileInfos } from '../../utils/index.js';
import constant from '../../config/constant.js';
import schema from '../../config/schema.js';
import appConfig from '../../config/app.js';
const fileInfos = fn_getFileInfos(import.meta.url);

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${fileInfos.pureFileName}`,
        schema: {},
        config: {},
        handler: async function (req, res) {
            try {
                let file = req.body.file;
                let extname = file.mimetype.split('/')[1];
                const buffer = await file.toBuffer();

                let result = await fastify.tencentOSS.putObject({
                    Bucket: appConfig.tencentOSS.bucket,
                    Region: appConfig.tencentOSS.region,
                    Key: `${nanoid()}.${extname}`,
                    Body: buffer
                });

                if (result.statusCode === 200) {
                    return {
                        ...constant.code.SUCCESS,
                        name: result.name,
                        url: result.Location
                    };
                } else {
                    fastify.log.error(result);
                    return constant.code.FAIL;
                }
            } catch (err) {
                fastify.log.error(err);
                return constant.code.FAIL;
            }
        }
    });
}
