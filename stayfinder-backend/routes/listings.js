const express = require('express');
const router = express.Router();
const {
  createListing,
  getAllListings,
  getListingById,
  getListingsByOwner,
  updateListing,
  deleteListing,
  addReview
} = require('../controllers/listingController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRolesMiddleware');
const upload = require('../middleware/cloudinaryStorage');

// Protected route to create a listing

router.get('/', getAllListings);
router.get('/:id', getListingById);
router.get('/user/:userId', verifyToken, authorizeRoles('host'), getListingsByOwner);
router.post('/', verifyToken, authorizeRoles('host'), upload.array('images', 5), createListing);
router.put('/:id', verifyToken, authorizeRoles('host'), upload.array('images', 5), updateListing);
router.delete('/:id', verifyToken, authorizeRoles('host'), deleteListing);
router.post('/:id/reviews', verifyToken, addReview);

module.exports = router;