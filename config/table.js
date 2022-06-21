const tableConfig = {
    id: {
        meta: {
            comment: '自增'
        },
        table: {
            type: sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        schema: {
            type: 'integer',
            minimum: 1
        }
    },
    uuid: {
        meta: {
            comment: '唯一ID'
        },
        table: {
            type: sequelize.DataTypes.STRING(200),
            allowNull: false
        },
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 200
        }
    },
    gender: {
        meta: {
            comment: '性别{female:女,male:男,unknow:未知}'
        },
        table: {
            type: sequelize.DataTypes.string(10),
            allowNull: false,
            defaultValue: 'unknow'
        },
        schema: {
            type: 'integer',
            enum: ['female', 'male', 'unknow']
        }
    },
    longitude: {
        meta: {
            comment: '经度'
        },
        table: {
            type: sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 50
        }
    },
    latitude: {
        meta: {
            comment: '纬度'
        },
        table: {
            type: sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 50
        }
    },
    state: {
        meta: {
            comment: '状态{normal:正常,disabled:禁用,deleted:删除}'
        },
        table: {
            type: sequelize.DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'normal'
        },
        schema: {
            type: 'string',
            enum: ['normal', 'disabled', 'deleted']
        }
    },
    intMin0: {
        meta: {
            comment: '最小数字为0的整数'
        },
        table: {
            type: sequelize.DataTypes.BIGINT,
            allowNull: false
        },
        schema: {
            type: 'integer',
            minimum: 0,
            maximum: 922337203685477580
        }
    },
    intMin1: {
        meta: {
            comment: '最小数字为1的整数'
        },
        table: {
            type: sequelize.DataTypes.BIGINT,
            allowNull: false
        },
        schema: {
            type: 'integer',
            minimum: 1,
            maximum: 922337203685477580
        }
    }
};

// 字符长度字典
let stringDict = [
    //
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000, 30000, 40000, 50000, 60000
];

stringDict.forEach((num) => {
    tableConfig[`str0to${num}`] = {
        meta: {
            comment: `字符串长度为0到${num}`
        },
        table: {
            type: sequelize.DataTypes.STRING(num),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: num
        }
    };
    tableConfig[`str1to${num}`] = {
        meta: {
            comment: `字符串长度为1到${num}`
        },
        table: {
            type: sequelize.DataTypes.STRING(num),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: num
        }
    };
});

export { tableConfig };
