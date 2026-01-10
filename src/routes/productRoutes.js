const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getAllProducts, 
    getProductById 
} = require('../controllers/productController');

// Admin only routes
router.post(
    '/add', 
    authMiddleware, 
    roleMiddleware('admin'), 
    addProduct
);

router.put(
    '/:product_id', 
    authMiddleware, 
    roleMiddleware('admin'), 
    updateProduct
);

router.delete(
    '/:product_id', 
    authMiddleware, 
    roleMiddleware('admin'), 
    deleteProduct
);

// Public routes (authenticated users - both admin and user can view)
router.get(
    '/', 
    authMiddleware, 
    getAllProducts
);

router.get(
    '/:product_id', 
    authMiddleware, 
    getProductById
);

module.exports = router;
