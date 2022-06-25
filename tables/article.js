import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const table = {
    option: {
        comment: '文章'
    },
    data: {
        id: utils.tableField('自增', 'id'),
        publisher_id: utils.tableField('发布者', 'intMin1'),
        title: utils.tableField('标题', 'str1to100'),
        describe: utils.tableField('描述', 'str0to500'),
        thumbnail: utils.tableField('缩略图', 'image'),
        content: utils.tableField('正文', 'content'),
        views: utils.tableField('浏览人数', 'intMin0'),
        is_recommend: utils.tableField('是否推荐', 'boolEnum'),
        state: utils.tableField('状态', 'state')
    }
};

export const { describe, name, data, option } = utils.getTableData(import.meta.url, table.data, table.option);
