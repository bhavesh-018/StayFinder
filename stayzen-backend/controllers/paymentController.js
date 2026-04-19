const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // 🔥 SAVE PAYMENT RECORD HERE
    await Payment.create({
      booking: bookingId,
      user: req.user._id,
      orderId: order.id,
      amount: amount,
      status: "PENDING"
    });

    res.json(order);

  } catch (err) {
    console.error("ERROR in createOrder:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    // 🔐 VERIFY SIGNATURE
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // ✅ UPDATE PAYMENT RECORD
    const payment = await Payment.findOne({ orderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = 'SUCCESS';
    await payment.save();

    // 🔥 CONFIRM BOOKING (SAFE NOW)
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'CONFIRMED';
    await booking.save();

    res.json({ message: 'Payment verified & booking confirmed' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed' });
  }
};