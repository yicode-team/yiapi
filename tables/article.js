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
    publisher_id: {
        meta: {
            comment: '发布者ID'
        },
        table: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        schema: {
            type: 'integer',
            minimum: 1
        }
    },
    title: {
        meta: {
            comment: '标题'
        },
        table: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100
        }
    },
    describe: {
        meta: {
            comment: '描述'
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
    thumbnail: {
        meta: {
            comment: '缩略图'
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
    content: {
        meta: {
            comment: '正文'
        },
        table: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 65535
        }
    },
    views: {
        meta: {
            comment: '浏览人数'
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
    recommend_state: {
        meta: {
            comment: '推荐状态'
        },
        table: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
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
    comment: '文章'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
