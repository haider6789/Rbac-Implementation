const pool = require('../models/userModel');
const bcrypt = require('bcrypt');

const seed = async () => {
    console.log("Seeding database...");

    try {
        // PERMISSIONS
        const permissions = [
            'create_product',
            'read_product',
            'update_product',
            'delete_product',
            'delete_user',
            'manage_users'
        ];

        const permissionMap = {};

        for (const perm of permissions) {
            const res = await pool.query(
                'INSERT INTO permissions (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id, name',
                [perm]
            );
            permissionMap[perm] = res.rows[0].id;
        }

        // ROLES
        const roles = ['admin', 'manager', 'staff', 'user'];
        const roleMap = {};

        for (const role of roles) {
            const res = await pool.query(
                'INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id, name',
                [role]
            );
            roleMap[role] = res.rows[0].id;
        }

        // ROLE PERMISSIONS
        // Admin: All
        for (const perm of permissions) {
            await pool.query(
                'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [roleMap['admin'], permissionMap[perm]]
            );
        }

        // Manager: All products, no user deletion
        const managerPerms = ['create_product', 'read_product', 'update_product', 'delete_product'];
        for (const perm of managerPerms) {
            await pool.query(
                'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [roleMap['manager'], permissionMap[perm]]
            );
        }

        // Staff: Read/Update products
        const staffPerms = ['read_product', 'update_product'];
        for (const perm of staffPerms) {
            await pool.query(
                'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [roleMap['staff'], permissionMap[perm]]
            );
        }

        // User: Read products
        await pool.query(
            'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [roleMap['user'], permissionMap['read_product']]
        );

        // CREATE ADMIN USER
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await pool.query(
            'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
            ['admin', hashedPassword, roleMap['admin']]
        );

        console.log("Database seeded successfully.");
        process.exit(0);

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

// Execute seeder
setTimeout(seed, 1000);
