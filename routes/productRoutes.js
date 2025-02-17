const express = require('express');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas protegidas
router.post('/', authMiddleware, createProduct);
router.get('/', authMiddleware, getProducts);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
