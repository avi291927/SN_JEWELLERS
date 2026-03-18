const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getDashboardStats } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getProducts);
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
