import * as _ from 'lodash-es';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import dayjs from 'dayjs';
import micromatch from 'micromatch';

import { jwtConfig } from '../config/jwt.js';
import { appConfig } from '../config/app.js';
import { constantConfig } from '../config/constant.js';
import * as utils from '../utils/index.js';

async function plugin(fastify, opts) {
    fastify.register(fastifyJwt, {
        secret: jwtConfig.secret,
        decode: {
            complete: true
        },
        sign: {
            algorithm: jwtConfig.algorithm,
            expiresIn: jwtConfig.expiresIn
        },
        verify: {
            algorithms: [jwtConfig.algorithm]
        }
    });

    fastify.addHook('preValidation', async (req, res) => {
        try {
            // 取得请求API路径
            req.apiPath = utils.routerPath(req.url);

            // 参数检测，前面和时间校验
            await utils.apiParamsCheck(req);

            // TODO: 缓存的接口也需要进行白名单判断
            // 从缓存获取白名单接口
            let dataApiWhiteLists = await fastify.redisGet('cacheData:apiWhiteLists', 'json');
            let whiteLists = dataApiWhiteLists?.map((item) => item.value);
            let allWhiteLists = _.uniq(_.concat(appConfig.whiteLists, whiteLists || []));

            // 设置默认访问角色为游客
            let visitor = {
                role_codes: 'visitor'
            };

            // 接口是否在白名单中
            let isWhitePass = micromatch.isMatch(req.apiPath, allWhiteLists);

            let token = req?.headers?.authorization?.split(' ')?.[1] || '666666';

            try {
                // 不论有没有登录，都进行jwt解析
                let jwtData = fastify.jwt.decode(token) || {};
                req.session = jwtData.payload || visitor;
            } catch (err) {
                req.session = visitor;
            }

            // 如果接口不在白名单中，则判断用户是否有接口访问权限
            if (!isWhitePass) {
                let userApis = await fastify.getUserApis(req.session);
                let hasApi = _.find(userApis, { value: req.apiPath });

                /**
                 * 如果当前请求的路由，不在用户许可内
                 * 如果会话有ID，则表示用户已登录，没有权限
                 * 如果没有会话ID，则表示用户未登录
                 * 如果有接口权限，则判断接口本身是否需要登录
                 */
                if (!hasApi) {
                    // 如果没有接口权限
                    if (req.session.id) {
                        // 判断是否登录，登录了就返回没有接口权限
                        res.send({
                            ...constantConfig.code.FAIL,
                            msg: `您没有 [ ${req?.context?.schema?.summary || req.apiPath} ] 接口的操作权限`
                        });
                        return res;
                    } else {
                        // 如果没登录，则返回未登录
                        res.send({
                            ...constantConfig.code.NOT_LOGIN,
                            data: '1'
                        });
                        return res;
                    }
                } else {
                    // 如果有接口权限，则判断接口本身是否需要登录
                    if (req.context.config.isLogin === true && !req.session.id) {
                        res.send({
                            ...constantConfig.code.NOT_LOGIN,
                            data: '2'
                        });
                        return res;
                    }
                }
            } else {
                // 如果在白名单中，则判断接口本身是否需要登录
                if (req.context.config.isLogin === true && !req.session.id) {
                    res.send({
                        ...constantConfig.code.NOT_LOGIN,
                        data: '3'
                    });
                    return res;
                }
            }
        } catch (err) {
            fastify.log.error(err);
            res.send({
                ...constantConfig.code.FAIL,
                msg: err.msg || '认证异常',
                other: err.other || ''
            });
            return res;
        }
    });
}
export default fp(plugin, { dependencies: ['cors', 'mysql'] });
