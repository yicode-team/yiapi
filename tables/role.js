import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const table = {
    option: {
        comment: '角色'
    },
    data: {
        id: utils.tableField('自增', 'id'),
        code: utils.tableField('角色编码', 'str1to20'),
        name: utils.tableField('角色名称', 'str1to50'),
        describe: utils.tableField('角色描述', 'str0to500'),
        menu_ids: utils.tableField('菜单集合', 'str0to5000'),
        api_ids: utils.tableField('接口集合', 'str0to5000'),
        state: utils.tableField('状态', 'state')
    }
};

export const { describe, name, data, option } = utils.getTableData(import.meta.url, table.data, table.option);
