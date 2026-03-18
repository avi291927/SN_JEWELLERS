const Enquiry = require('../models/Enquiry');

exports.createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, message, product } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const enquiry = await Enquiry.create({ name, email, phone, message, product: product || null });
        res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting enquiry' });
    }
};

exports.getEnquiries = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Enquiry.countDocuments(filter);
        const enquiries = await Enquiry.find(filter)
            .populate('product', 'name category price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        res.json({ enquiries, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enquiries' });
    }
};

exports.updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('product', 'name category price');
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: 'Error updating enquiry' });
    }
};

exports.deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting enquiry' });
    }
};

exports.getEnquiryStats = async (req, res) => {
    try {
        const total = await Enquiry.countDocuments();
        const newCount = await Enquiry.countDocuments({ status: 'new' });
        const readCount = await Enquiry.countDocuments({ status: 'read' });
        const repliedCount = await Enquiry.countDocuments({ status: 'replied' });
        res.json({ total, new: newCount, read: readCount, replied: repliedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enquiry stats' });
    }
};
