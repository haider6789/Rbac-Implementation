const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://postgres:root@localhost:5432/rbac_db"
});

const createTable = async () => {




  const rolesQuery = `
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL
    );
  `;

  const permissionsQuery = `
    CREATE TABLE IF NOT EXISTS permissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL
    );
  `;

  const usersQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role_id INT REFERENCES roles(id) ON DELETE SET NULL
    );
  `;

  const productsQuery = `
    CREATE TABLE IF NOT EXISTS products (
      product_id SERIAL PRIMARY KEY,
      product_name VARCHAR(100) NOT NULL UNIQUE
    );
  `;

  const rolePermissionsQuery = `
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id INT REFERENCES roles(id) ON DELETE CASCADE,
      permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
    );
  `;

  try {
    // In a real production environment, you would use migration tools (like Knex or TypeORM)
    // instead of creating tables on startup.

    await Promise.all([
      pool.query(rolesQuery),
      pool.query(permissionsQuery),
      pool.query(productsQuery)
    ]);
    // Create users after roles because of foreign key
    await pool.query(usersQuery);
    await pool.query(rolePermissionsQuery);

    console.log("Database schema updated successfully");
  } catch (err) {
    console.error("Error creating tables:", err.stack);
  }
};

createTable();

module.exports = pool; //export the pool