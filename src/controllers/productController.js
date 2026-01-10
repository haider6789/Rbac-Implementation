const pool = require('../models/userModel'); // Database pool

// Admin: Add a new product
const addProduct = async (req, res) => {
    try {
        const { product_name } = req.body;

        if (!product_name || product_name.trim() === '') {
            return res.status(400).json({ error: 'Product name is required' });
        }

        const result = await pool.query(
            'INSERT INTO products (product_name) VALUES ($1) RETURNING *',
            [product_name]
        );

        res.status(201).json({ 
            message: 'Product added successfully',
            product: result.rows[0]
        });

    } catch (error) {
        console.error('Add product error:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Product name already exists' });
        }
        res.status(500).json({ error: 'Failed to add product' });
    }
};

// Admin: Update a product
const updateProduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { product_name } = req.body;

        if (!product_name || product_name.trim() === '') {
            return res.status(400).json({ error: 'Product name is required' });
        }

        // Check if product exists
        const checkResult = await pool.query(
            'SELECT * FROM products WHERE product_id = $1',
            [product_id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const result = await pool.query(
            'UPDATE products SET product_name = $1 WHERE product_id = $2 RETURNING *',
            [product_name, product_id]
        );

        res.json({ 
            message: 'Product updated successfully',
            product: result.rows[0]
        });

    } catch (error) {
        console.error('Update product error:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Product name already exists' });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// Admin: Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { product_id } = req.params;

        // Check if product exists
        const checkResult = await pool.query(
            'SELECT * FROM products WHERE product_id = $1',
            [product_id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await pool.query(
            'DELETE FROM products WHERE product_id = $1',
            [product_id]
        );

        res.json({ message: 'Product deleted successfully' });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

// User/Admin: View all products
const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY product_id');
        res.json({ 
            message: 'Products retrieved successfully',
            products: result.rows 
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// User/Admin: View a specific product
const getProductById = async (req, res) => {
    try {
        const { product_id } = req.params;

        const result = await pool.query(
            'SELECT * FROM products WHERE product_id = $1',
            [product_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product: result.rows[0] });

    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

module.exports = { addProduct, updateProduct, deleteProduct, getAllProducts, getProductById };
