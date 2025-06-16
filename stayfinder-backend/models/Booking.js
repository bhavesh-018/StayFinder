const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  checkIn: {type: Date, required: true, set: (v) => new Date(new Date(v).toISOString().split('T')[0]) },
  checkOut: {type: Date, required: true, set: (v) => new Date(new Date(v).toISOString().split('T')[0]) },
  price: {type: Number, required: true},
  status: {
    type: String,
    enum: ['ACTIVE', 'CANCELLED'],
    default: 'ACTIVE',
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);