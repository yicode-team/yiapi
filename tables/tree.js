import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const data = {
    id: utils.tableField('自增', 'id'),
    pid: utils.tableField('父级ID', 'intMin0'),
    pids: utils.tableField('父级ID链', 'str1to5000', '0', null, 1),
    type: utils.tableField('类型', 'str1to20'),
    icon: utils.tableField('图标', 'image'),
    name: utils.tableField('名称', 'str1to100'),
    value: utils.tableField('值', 'str0to500'),
    sort: utils.tableField('排序', 'intMin0'),
    describe: utils.tableField('描述', 'str0to500'),
    level: utils.tableField('层次', 'intMin1'),
    is_bool: utils.tableField('真假树（0:虚拟的,1:真实的）', 'boolEnum'),
    is_open: utils.tableField('是否公开', 'boolEnum'),
    state: utils.tableField('状态', 'state')
};

const option = {
    comment: '目录'
};

export const { tableDescribe, tableName, tableData, tableOption } = utils.getTableData(import.meta.url, data, option);
