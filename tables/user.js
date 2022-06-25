import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const data = {
    id: utils.tableField('自增', 'id'),
    // 用户信息
    uuid: utils.tableField('唯一ID', 'uuid'),
    username: utils.tableField('用户名', 'str0to20', ''),
    phone: utils.tableField('手机号', 'strCustom', ''),
    password: utils.tableField('密码', 'strCustom', '', 200, 6),
    nickname: utils.tableField('昵称', 'str1to50'),
    avatar: utils.tableField('头像', 'str1to300'),
    gender: utils.tableField('性别', 'gender'),
    role_codes: utils.tableField('角色码', 'str0to500'),
    // 认证信息
    realname: utils.tableField('真实姓名', 'str1to30'),
    weixin: utils.tableField('微信号', 'str1to50'),
    qq: utils.tableField('qq号', 'str1to20'),
    email: utils.tableField('邮箱', 'str1to30'),
    idcard_no: utils.tableField('身份证号', 'str1to30'),
    idcard_zhen: utils.tableField('身份证正面', 'str1to300'),
    idcard_fan: utils.tableField('身份证反面', 'str1to300'),
    // 时间信息
    login_at: utils.tableField('登录时间', 'intMin0'),
    login_ip: utils.tableField('登录IP', 'str0to50'),
    state: utils.tableField('状态', 'state')
};

const option = {
    comment: '用户'
};

export const { tableDescribe, tableName, tableData, tableOption } = utils.getTableData(import.meta.url, data, option);
