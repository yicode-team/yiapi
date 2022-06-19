import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const data = {
    id: {
        meta: {
            comment: '自增'
        },
        table: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        schema: {
            type: 'integer',
            minimum: 1
        }
    },
    code: {
        meta: {
            comment: '字典编码'
        },
        table: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 50
        }
    },
    name: {
        meta: {
            comment: '字典名称'
        },
        table: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 200
        }
    },
    value: {
        meta: {
            comment: '字典值'
        },
        table: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 500
        }
    },
    type: {
        meta: {
            comment: '字典类型'
        },
        table: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'string'
        },
        schema: {
            type: 'string',
            enum: ['number', 'string']
        }
    },
    sort: {
        meta: {
            comment: '排序'
        },
        table: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        schema: {
            type: 'integer',
            minimum: 0
        }
    },
    describe: {
        meta: {
            comment: '分类描述'
        },
        table: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200
        }
    },
    content: {
        meta: {
            comment: '分类内容'
        },
        table: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 100000
        }
    },
    state: {
        meta: {
            comment: '状态'
        },
        table: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1, 2]
        }
    }
};

const option = {
    comment: '字典'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
