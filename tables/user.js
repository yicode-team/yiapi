import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const table = {
    option: {
        comment: '用户'
    },
    data: {
        id: utils.tableField('自增', 'id'),
        // 用户信息
        uuid: utils.tableField('唯一ID', 'uuid'),
        username: utils.tableField('用户名', 'str0to20', ''),
        phone: utils.tableField('手机号', 'strCustom', ''),
        password: utils.tableField('密码', 'strCustom', '', 200, 6),
        nickname: utils.tableField('昵称', 'str1to50'),
        avatar: utils.tableField('头像', 'image'),
        gender: utils.tableField('性别', 'gender'),
        role_codes: utils.tableField('角色码', 'str0to500', 'user'),
        bio: utils.tableField('签名', 'str0to200'),
        is_recommend: utils.tableField('是否推荐', 'boolEnum'),
        is_top: utils.tableField('是否置顶', 'boolEnum'),
        // 认证信息
        realname: utils.tableField('真实姓名', 'str1to30'),
        weixin: utils.tableField('微信号', 'str1to50'),
        qq: utils.tableField('qq号', 'str0to20'),
        email: utils.tableField('邮箱', 'str0to30'),
        idcard_no: utils.tableField('身份证号', 'str1to30'),
        idcard_zhen: utils.tableField('身份证正面', 'image'),
        idcard_fan: utils.tableField('身份证反面', 'image'),
        audit_state: utils.tableField('审核状态（none|未审核,ing|审核中,pass|已通过,refuse|已拒绝）', 'strEnum', 'none', 20, null, ['none', 'ing', 'pass', 'refuse']),
        // 地址信息
        longitude: utils.tableField('经度', 'longitude'),
        latitude: utils.tableField('纬度', 'latitude'),
        province: utils.tableField('省', 'str0to50'),
        city: utils.tableField('市', 'str0to50'),
        region: utils.tableField('区', 'str0to50'),
        address: utils.tableField('地址', 'str0to200'),
        // 时间信息
        login_at: utils.tableField('登录时间', 'intMin0'),
        login_ip: utils.tableField('登录IP', 'str0to30'),
        state: utils.tableField('状态', 'state')
    }
};

export const { describe, name, data, option } = utils.getTableData(import.meta.url, table.data, table.option);
