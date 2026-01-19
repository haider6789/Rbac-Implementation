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
    checkPermission('create_product'),
    addProduct
);

router.put(
    '/:product_id',
    authMiddleware,
    checkPermission('update_product'),
    updateProduct
);

router.delete(
    '/:product_id',
    authMiddleware,
    checkPermission('delete_product'),
    deleteProduct
);

//public routes (both admin and user can view-should be authenticated)
router.get(
    '/',
    authMiddleware,
    checkPermission('read_product'),
    getAllProducts
);

router.get(
    '/:product_id',
    authMiddleware,
    checkPermission('read_product'),
    getProductById
);

module.exports = router;
