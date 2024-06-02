const { Pool } = require('pg');


const dbConfig = {
    user: DB_USERNAME,
    host: DB_HOSTNAME,
    database: DB_DATABASE_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
    dialectOptions: {
        ssl: {
          require: true, // Требуется использование SSL/TLS
          rejectUnauthorized: true // Отключение проверки сертификата (небезопасно в рабочей среде)
        }
      }
};

const pool = new Pool(dbConfig);

module.exports = pool;