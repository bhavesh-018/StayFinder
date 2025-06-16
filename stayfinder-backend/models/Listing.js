const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  price: { type: Number, required: true },
  image: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailableForUpdate: {
    type: Boolean,
    default: true, 
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);