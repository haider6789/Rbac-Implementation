const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://postgres:root@localhost:5432/rbac_db"
});

const createTable = async () => {
  const userQuery = `
    CREATE TABLE IF NOT EXISTS users (
      username VARCHAR(50) PRIMARY KEY,
      password TEXT NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user'))
    );
  `;
  const productsQuery = `
    CREATE TABLE IF NOT EXISTS products (
      product_id SERIAL PRIMARY KEY,
      product_name VARCHAR(100) NOT NULL UNIQUE
    );
  `;
  try {
    await pool.query(userQuery);
    console.log("Users table created successfully!");
    await pool.query(productsQuery);
    console.log("Products table created successfully!");
  } catch (err) {
    console.error("Error creating table:", err.stack);
  }
};

createTable();

module.exports = pool; // Export the pool