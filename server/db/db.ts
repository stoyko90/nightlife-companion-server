import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

//'postgres', 'omeunome'
//'user', '1234',
const DB_NAME = process.env['DB_NAME'] || 'test';
const DB_USER = process.env['DB_USER'] || 'postgres';
const DB_PASSWORD = process.env['DB_PASSWORD'] || 'omeunome';
const DB_HOST = process.env['DB_HOST'] || 'localhost';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});

(async function f1() {
  try {
    // await sequelize.sync({ force: true });
    await sequelize.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;
