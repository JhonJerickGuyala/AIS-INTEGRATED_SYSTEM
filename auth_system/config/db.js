import mysql from 'mysql2/promise.js'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  // Ang logic na ito ay sisiguraduhin na hindi magpapasa ng password kung empty ang .env
  password: process.env.DB_PASSWORD || undefined, 
  database: process.env.DB_NAME || 'authdb'
})

export default pool;