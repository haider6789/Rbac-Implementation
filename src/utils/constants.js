const ProductPermissions = {
    CREATE: 'create_product',
    UPDATE: 'update_product',
    DELETE: 'delete_product',
    READ: 'read_product'
}

module.exports = {
    addProduct: ProductPermissions.CREATE,
    updateProduct: ProductPermissions.UPDATE,
    deleteProduct: ProductPermissions.DELETE,
    getAllProducts: ProductPermissions.READ,
    getProductById: ProductPermissions.READ
};
