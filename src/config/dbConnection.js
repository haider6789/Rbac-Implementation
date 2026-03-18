require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:root@localhost:5432/rbac_db",
});

module.exports = pool;
