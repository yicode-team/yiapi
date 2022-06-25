import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const table = {
    option: {
        comment: '反馈'
    },
    data: {
        id: utils.tableField('自增', 'id'),
        user_id: utils.tableField('唯一ID', 'uuid'),
        content: utils.tableField('反馈内容', 'str0to5000'),
        reply: utils.tableField('回复内容', 'str0to5000')
    }
};

export const { describe, name, data, option } = utils.getTableData(import.meta.url, table.data, table.option);
