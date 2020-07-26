const { DataTypes, Sequelize, literal } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: "mysql",
    host: process.env.DB_HOST,
    logging: false
});

const modelAttributesAndOptions = {
    scores: {
        attributes: {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT.UNSIGNED
            },
            name: {
                allowNull: false,
                type: new DataTypes.STRING
            },
            score: {
                allowNull: false,
                type: DataTypes.BIGINT.UNSIGNED
            },
            scoredAt: {
                allowNull: false,
                defaultValue: literal("CURRENT_TIMESTAMP"),
                type: new DataTypes.DATE
            }
        },
        options: {
            indexes: [
                {
                    fields: ["name"],
                    unique: true
                }
            ]
        }
    }
};

Object.keys(modelAttributesAndOptions).forEach((modelName) => {
    sequelize.define(modelName, modelAttributesAndOptions[modelName].attributes, {
        ...modelAttributesAndOptions[modelName].options,
        tableName: modelName,
        timestamps: false
    });
});

module.exports = sequelize;