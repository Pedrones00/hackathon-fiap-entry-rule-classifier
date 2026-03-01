import {DataTypes, Model} from "sequelize";
import db from '../../config/db.js';

export default () => {
    class Rule extends Model {}

    Rule.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            agency: {
                type: DataTypes.STRING(4),
                allowNull: false,
                validate: {
                    len: [4, 4],
                    isNumeric: true
                }
            },
            account: {
                type: DataTypes.STRING(10),
                allowNull: false,
                validate: {
                    len: [1, 10],
                    isNumeric: true
                }
            },
            entryNamePattern: {
                type: DataTypes.STRING(20),
                allowNull: false,
                validate: {
                    len: [1, 20]
                }
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    len: [1, 50]
                }
            }
        },
        {
            sequelize: db.connection,
            modelName: 'rule',
            tableName: 'rules'
        }
    );
    
    return Rule;
}