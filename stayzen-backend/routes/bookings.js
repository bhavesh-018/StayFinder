const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getUserBookingById, updateBooking, cancelBooking, confirmBooking, getHostBookings } = require('../controllers/bookingController');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRolesMiddleware');

router.post('/', verifyToken, authorizeRoles('guest'), createBooking);

router.post('/create-order', verifyToken, createOrder);
router.post('/verify-payment', verifyToken, verifyPayment);
router.post('/:id/confirm', verifyToken, authorizeRoles('guest'), confirmBooking);
router.get('/', verifyToken, getUserBookings);
router.get('/host', verifyToken, authorizeRoles('host'), getHostBookings);
router.get('/:id', verifyToken, getUserBookingById);
router.patch('/:id/cancel', verifyToken, cancelBooking);


module.exports = router;