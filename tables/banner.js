import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const data = {
    id: utils.tableField('自增', 'id'),
    link: utils.tableField('跳转地址', 'str0to500'),
    title: utils.tableField('轮播标题', 'str0to100'),
    thumbnail: utils.tableField('缩略图', 'image'),
    is_recommend: utils.tableField('是否推荐', 'boolEnum'),
    state: utils.tableField('状态', 'state')
};

const option = {
    comment: '轮播图'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
