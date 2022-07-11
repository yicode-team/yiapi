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
            summary: `更新树`,
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`,
            body: {
                type: 'object',
                properties: {
                    id: treeTable.data.id.schema,
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
                required: ['id']
            }
        },
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            const trxProvider = fastify.mysql.transactionProvider();
            const trx = await trxProvider();
            try {
                let treeModel = trx.table('tree');

                let parentData = undefined;

                // 如果传了pid值
                if (req.body.pid) {
                    parentData = await treeModel.clone().where('id', req.body.pid).first();
                    if (parentData === undefined) {
                        return { ...constantConfig.code.FAIL, msg: '父级树不存在' };
                    }
                }

                let selfData = await treeModel.clone().where('id', req.body.id).first();
                if (selfData === undefined) {
                    return { ...constantConfig.code.FAIL, msg: '菜单不存在' };
                }

                // 需要更新的数据
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
                    updated_at: utils.getTimestamp()
                };

                if (parentData !== undefined) {
                    data.pids = [parentData.pids, parentData.id].join(',');
                }
                let updateResult = await treeModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .update(utils.clearEmptyData(data));

                // 如果更新成功，则更新所有子级
                if (updateResult) {
                    let childrenPids = [data.pids || selfData.pid, req.body.id];
                    await treeModel
                        .clone()
                        .where({ pid: req.body.id })
                        .update({
                            pids: childrenPids.join(','),
                            level: childrenPids.length,
                            updated_at: utils.getTimestamp()
                        });
                }

                await trx.commit();
                await fastify.cacheTreeData();
                return constantConfig.code.UPDATE_SUCCESS;
            } catch (err) {
                await trx.rollback();
                fastify.log.error(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
