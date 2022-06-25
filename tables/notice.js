import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const table = {
    option: {
        comment: '公告'
    },
    data: {
        id: utils.tableField('自增', 'id'),
        publisher_id: utils.tableField('发布者', 'intMin1'),
        publisher_nickname: utils.tableField('发布者昵称', 'str1to30'),
        publisher_phone: utils.tableField('发布者手机号', 'phone'),
        title: utils.tableField('公告标题', 'str0to100'),
        summary: utils.tableField('公告摘要', 'str0to500'),
        thumbnail: utils.tableField('公告缩略图', 'image'),
        views: utils.tableField('浏览人数', 'intMin0'),
        content: utils.tableField('公告正文', 'content'),
        is_recommend: utils.tableField('是否推荐', 'boolEnum'),
        state: utils.tableField('状态', 'state')
    }
};

export const { describe, name, data, option } = utils.getTableData(import.meta.url, table.data, table.option);
