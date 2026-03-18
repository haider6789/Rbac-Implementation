const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById
} = require('../controllers/productController');

//admin/manager routes (permission based)
router.post(
    '/',
    authMiddleware,
    checkPermission('createProduct'),
    addProduct
);

router.put(
    '/:product_id',
    authMiddleware,
    checkPermission('updateProduct'),
    updateProduct
);

router.delete(
    '/:product_id',
    authMiddleware,
    checkPermission('deleteProduct'),
    deleteProduct
);

//public routes (both admin and user can view-should be authenticated)
router.get(
    '/',
    authMiddleware,
    checkPermission('getAllProducts'),
    getAllProducts
);

router.get(
    '/:product_id',
    authMiddleware,
    checkPermission('getProductById'),
    getProductById
);

module.exports = router;
