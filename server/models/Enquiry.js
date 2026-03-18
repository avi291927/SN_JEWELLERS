const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxlength: 1000
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Enquiry', enquirySchema);
