import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const table = {
    option: {
        comment: '目录树'
    },
    data: {
        id: utils.tableField('自增', 'id'),
        pid: utils.tableField('父级ID', 'intMin0'),
        pids: utils.tableField('父级ID链', 'str1to5000', '0', null, 1),
        category: utils.tableField('分类编码', 'str1to100'),
        icon: utils.tableField('图标', 'image'),
        name: utils.tableField('名称', 'str1to100'),
        value: utils.tableField('值', 'str0to500'),
        sort: utils.tableField('排序', 'intMin0'),
        describe: utils.tableField('描述', 'str0to500'),
        thumbnail: utils.tableField('缩略图', 'str0to300'),
        images: utils.tableField('图片列表', 'str0to2000'),
        content: utils.tableField('字典内容', 'content'),
        level: utils.tableField('层次', 'intMin1'),
        is_bool: utils.tableField('真假树（0:虚拟的,1:真实的）', 'boolEnum'),
        is_open: utils.tableField('是否公开', 'boolEnum'),
        state: utils.tableField('状态', 'state')
    }
};

export const { describe, name, data, option } = utils.getTableData(import.meta.url, table.data, table.option);
