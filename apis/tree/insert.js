import * as _ from 'lodash-es';
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
            summary: `添加树`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    pid: treeTable.data.pid.schema,
                    category: treeTable.data.category.schema,
                    name: treeTable.data.name.schema,
                    value: treeTable.data.value.schema,
                    icon: treeTable.data.icon.schema,
                    sort: treeTable.data.sort.schema,
                    describe: treeTable.data.describe.schema,
                    is_bool: treeTable.data.is_bool.schema,
                    is_open: treeTable.data.is_open.schema
                },
                required: ['pid', 'category', 'name']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table('tree')
                    .modify(function (queryBuilder) {});
                if (req.body.pid === 0) {
                    req.body.pids = '0';
                    req.body.level = 1;
                } else {
                    let parentPermission = await model.clone().where('id', req.body.pid).first();
                    if (!parentPermission) {
                        return { ...constantConfig.code.FAIL, msg: '父级树不存在' };
                    }
                    req.body.pids = `${parentPermission.pids},${parentPermission.id}`;
                    req.body.level = req.body.pids.split(',').length;
                }

                let data = {
                    pid: req.body.pid,
                    category: req.body.category,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    is_bool: req.body.is_bool,
                    describe: req.body.describe,
                    pids: req.body.pids,
                    level: req.body.level,
                    created_at: utils.getTimestamp(),
                    updated_at: utils.getTimestamp()
                };
                let result = await model
                    //
                    .clone()
                    .insert(utils.clearEmptyData(data));

                await fastify.cacheTreeData();

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
