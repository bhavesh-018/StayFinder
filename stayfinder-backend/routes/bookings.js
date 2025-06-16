const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getUserBookingById, updateBooking, cancelBooking } = require('../controllers/bookingController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRolesMiddleware');

router.post('/', verifyToken, authorizeRoles('guest'), createBooking);
router.get('/', verifyToken, getUserBookings);
router.get('/:id', verifyToken, getUserBookingById);
router.put('/:id', verifyToken, updateBooking);
router.patch('/:id/cancel', verifyToken, cancelBooking);

module.exports = router;