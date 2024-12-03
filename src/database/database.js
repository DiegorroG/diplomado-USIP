import { Sequelize } from "sequelize";
import 'dotenv/config'

const sequelize = new Sequelize(
    // db name
    process.env.DB_DATABASE,
    // username db
    process.env.DB_USER,
    //password
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging:console.log,

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        }
        
    }
);

export default sequelize;