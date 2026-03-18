const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

exports.getProducts = async (req, res) => {
    try {
        const { category, subcategory, minPrice, maxPrice, sort, search, featured, page = 1, limit = 12 } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (subcategory) filter.subcategory = subcategory;
        if (featured === 'true') filter.featured = true;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        else if (sort === 'price_desc') sortOption = { price: -1 };
        else if (sort === 'name') sortOption = { name: 1 };

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        res.json({
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, weight, purity, inStock, featured } = req.body;
        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
        const product = await Product.create({
            name, description, price: Number(price), category, subcategory,
            images, weight, purity,
            inStock: inStock === 'true' || inStock === true,
            featured: featured === 'true' || featured === true
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { name, description, price, category, subcategory, weight, purity, inStock, featured, existingImages } = req.body;
        let images = [];
        if (existingImages) {
            images = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
        }
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(f => `/uploads/${f.filename}`);
            images = [...images, ...newImages];
        }
        const updated = await Product.findByIdAndUpdate(req.params.id, {
            name: name || product.name,
            description: description || product.description,
            price: price ? Number(price) : product.price,
            category: category || product.category,
            subcategory: subcategory || product.subcategory,
            weight: weight !== undefined ? weight : product.weight,
            purity: purity !== undefined ? purity : product.purity,
            inStock: inStock !== undefined ? (inStock === 'true' || inStock === true) : product.inStock,
            featured: featured !== undefined ? (featured === 'true' || featured === true) : product.featured,
            images: images.length > 0 ? images : product.images
        }, { new: true, runValidators: true });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Delete associated images
        product.images.forEach(img => {
            const imgPath = path.join(__dirname, '..', img);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        });
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const goldProducts = await Product.countDocuments({ category: 'gold' });
        const silverProducts = await Product.countDocuments({ category: 'silver' });
        const featuredProducts = await Product.countDocuments({ featured: true });
        res.json({ totalProducts, goldProducts, silverProducts, featuredProducts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
