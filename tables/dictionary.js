import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const data = {
    id: utils.tableField('自增', 'id'),
    code: utils.tableField('字典编码', 'code'),
    name: utils.tableField('字典名称', 'str0to100'),
    value: utils.tableField('字典值', 'str0to500'),
    type: utils.tableField('字典类型', 'strEnum', 'string', 20, null, ['number', 'string']),
    sort: utils.tableField('字典排序', 'intMin0'),
    describe: utils.tableField('字典描述', 'str0to200'),
    content: utils.tableField('字典内容', 'content'),
    state: utils.tableField('字典状态', 'state')
};

const option = {
    comment: '字典'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
