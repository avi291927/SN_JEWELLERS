const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: 2000
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['gold', 'silver']
    },
    subcategory: {
        type: String,
        required: [true, 'Subcategory is required'],
        enum: ['necklace', 'ring', 'earring', 'bracelet', 'bangle', 'pendant', 'chain', 'anklet', 'other']
    },
    images: [{
        type: String
    }],
    weight: {
        type: String,
        default: ''
    },
    purity: {
        type: String,
        default: ''
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
