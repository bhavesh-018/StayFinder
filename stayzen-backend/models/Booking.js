const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },

  checkIn: {
    type: Date,
    required: true,
    set: (v) =>
      new Date(new Date(v).toISOString().split('T')[0])
  },

  checkOut: {
    type: Date,
    required: true,
    set: (v) =>
      new Date(new Date(v).toISOString().split('T')[0])
  },

  price: { type: Number, required: true },

  roomsBooked: {
    type: Number,
    required: true,
    default: 1
  },

  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'],
    default: 'PENDING'
  },

  expiresAt: {
    type: Date,
    default: () =>
      new Date(Date.now() + 10 * 60 * 1000) // 10 min lock
  }

}, { timestamps: true });

// indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', bookingSchema);