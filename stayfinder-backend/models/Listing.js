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
  images: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalRooms: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  isAvailableForUpdate: {
    type: Boolean,
    default: true, 
  },
  amenities: [
    {
      type: String
    }
  ],
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

listingSchema.index({ location: 1, price: 1 });
listingSchema.index({ owner: 1 });
listingSchema.index({ title: 1 });

module.exports = mongoose.model('Listing', listingSchema);