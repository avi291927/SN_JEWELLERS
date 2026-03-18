const express = require('express');
const { createEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry, getEnquiryStats } = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', protect, adminOnly, getEnquiries);
router.get('/stats', protect, adminOnly, getEnquiryStats);
router.put('/:id', protect, adminOnly, updateEnquiryStatus);
router.delete('/:id', protect, adminOnly, deleteEnquiry);

module.exports = router;
