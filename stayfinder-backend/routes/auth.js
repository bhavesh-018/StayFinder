const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/protected', protect, (req, res) => {
  res.status(200).json({ message: 'Access granted!', userId: req.user });
});
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;