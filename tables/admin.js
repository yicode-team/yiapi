import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const data = {
    id: utils.tableField('自增', 'id'),
    uuid: utils.tableField('唯一ID', 'uuid'),
    role_codes: utils.tableField('角色码组', 'str0to2000'),
    username: utils.tableField('用户名', 'str1to50'),
    password: utils.tableField('密码', 'str0to200'),
    nickname: utils.tableField('昵称', 'str0to50'),
    phone: utils.tableField('手机号', 'phone'),
    weixin: utils.tableField('微信号', 'str0to20'),
    qq: utils.tableField('QQ号', 'str0to20'),
    email: utils.tableField('邮箱', 'str0to50'),
    avatar: utils.tableField('头像', 'image'),
    state: utils.tableField('状态', 'state')
};

const option = {
    comment: '管理员'
};

export const { tableDescribe, tableName, tableData, tableOption } = utils.getTableData(import.meta.url, data, option);
