import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg
 export const POOL = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    allowExitOnIdle: true
})

try {
  //  console.log(await POOL.query('SELECT NOW()'));
    console.log("conexión exitosa en la base de datos!! ");
} catch (error) {
    console.log(error);
}