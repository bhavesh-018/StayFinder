const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  orderId: String,
  paymentId: String,
  signature: String,

  amount: Number,
  currency: {
    type: String,
    default: 'INR'
  },

  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING'
  }

}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);