import 'dotenv/config';
import { Sequelize } from 'sequelize';

class DBConnection {

    #parametersDB;
    #connection;

    constructor() {
        this.#parametersDB = {
            dialect: 'sqlite',
            storage: process.env.DATABASE_PATH || './storage/database.sqlite',
            logging: process.env.DB_LOGGING === 'true' ? console.log : false,
            define: {
                underscored: true,
                timestamps: true
            }
        },
        this.#connection = new Sequelize(this.#parametersDB)
    }

    async connect() {
        try {
            await this.#connection.authenticate();
            console.log(`Sucessfully connected to SQLite at: ${this.#parametersDB.storage}`);
        } catch (error) {
            console.log(`Error connecting: ${error}`);
            process.exit(1);
        }
    }

    async close_connection() {

        try {
            await this.#connection.close();
            console.log('Connection closed');
        } catch (error) {
            console.log(`Error closing the connection: ${error}`);
            process.exit(1);
        }

    }

    get connection() {
        return this.#connection;
    }



}

export default new DBConnection();