import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const data = {
    id: utils.tableField('自增', 'id'),
    user_id: utils.tableField('唯一ID', 'uuid'),
    content: utils.tableField('反馈内容', 'str0to5000'),
    reply: utils.tableField('回复内容', 'str0to5000')
};

const option = {
    comment: '反馈'
};

export const { tableDescribe, tableName, tableData, tableOption } = utils.getTableData(import.meta.url, data, option);
