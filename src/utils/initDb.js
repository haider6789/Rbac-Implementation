const pool = require('../config/dbConnection');

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
        await Promise.all([
            pool.query(rolesQuery),
            pool.query(permissionsQuery),
            pool.query(productsQuery)
        ]);
        // Create users and role permissions after roles/permissions because of foreign keys
        await pool.query(usersQuery);
        await pool.query(rolePermissionsQuery);

        console.log("Database schema updated successfully");
    } catch (err) {
        console.error("Error creating tables:", err.stack);
    } finally {
        // Close pool to allow process to exit
        await pool.end();
    }
};

createTable();
