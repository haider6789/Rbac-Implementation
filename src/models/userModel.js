const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://postgres:root@localhost:5432/rbac_db"
});

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(50) PRIMARY KEY,
      password TEXT NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user'))
    );
  `;
  try {
    await pool.query(query);
    console.log("Table created successfully!");
  } catch (err) {
    console.error("Error creating table:", err.stack);
  }
};

createTable();

module.exports = pool; // Export the pool