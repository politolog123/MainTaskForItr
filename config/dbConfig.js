const { Pool } = require('pg');

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'node_postgres',
    password: 'qwerty241098',
    port: 5432,
};

const pool = new Pool(dbConfig);

module.exports = pool;