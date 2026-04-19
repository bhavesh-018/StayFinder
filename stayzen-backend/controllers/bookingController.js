const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const mongoose = require('mongoose');

const formatDate = (date) => {
  const parsed = new Date(date);
  if (isNaN(parsed)) return null; // or throw an error
  return parsed.toISOString().split('T')[0];
};

exports.createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, roomsBooked } = req.body;
    const userId = req.user.id || req.user;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (start >= end) {
      throw new Error('Invalid date range');
    }

    const listing = await Listing.findById(listingId);

    if (!listing) throw new Error('Listing not found');

    if (listing.owner.toString() === userId.toString()) {
      throw new Error('You cannot book your own listing');
    }

    const requestedRooms = Number(roomsBooked) || 1;

    const activeBookings = await Booking.find({
      listing: listingId,
      status: { $in: ['PENDING', 'CONFIRMED'] },
      checkIn: { $lt: end },
      checkOut: { $gt: start }
    });

    const roomsAlreadyHeld = activeBookings.reduce(
      (sum, b) => sum + (b.roomsBooked || 1),
      0
    );

    const availableRooms = listing.totalRooms - roomsAlreadyHeld;

    if (availableRooms < requestedRooms) {
      throw new Error(`Only ${availableRooms} rooms available`);
    }

    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price * requestedRooms;

    const booking = await Booking.create({
      listing: listingId,
      user: userId,
      checkIn: start,
      checkOut: end,
      price: totalPrice,
      roomsBooked: requestedRooms,
      status: 'PENDING'
    });

    res.status(201).json(booking);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.confirmBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bookingId = req.params.id;

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, status: 'PENDING' },
      { $set: { status: 'PROCESSING' } },
      { new: true, session }
    );

    if (!booking) {
      throw new Error('Booking already processed');
    }

    const updatedListing = await Listing.findOneAndUpdate(
      {
        _id: booking.listing,
        availableRooms: { $gte: booking.roomsBooked }
      },
      {
        $inc: { availableRooms: -booking.roomsBooked }
      },
      { new: true, session }
    );

    if (!updatedListing) {
      booking.status = 'FAILED';
      await booking.save({ session });

      throw new Error('Not enough rooms available');
    }

    if (booking.expiresAt < new Date()) {
      booking.status = 'EXPIRED';
      await booking.save();
      throw new Error('Booking expired');
    }

    booking.status = 'CONFIRMED';
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Booking confirmed' });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ message: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user }).populate('listing');

    const formatted = bookings.map(b => ({
      _id: b._id,
      status: b.status,
      listing: b.listing,
      user: b.user,
      checkIn: b.checkIn ? formatDate(b.checkIn) : null,
      checkOut: b.checkOut ? formatDate(b.checkOut) : null,
      price: b.price,
      roomsBooked: b.roomsBooked,
      createdAt: formatDate(b.createdAt),
      updatedAt: formatDate(b.updatedAt)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ ERROR in getUserBookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the authenticated user
    if (booking.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({
      _id: booking._id,
      status: booking.status,
      listing: booking.listing,
      user: booking.user,
      checkIn: booking.checkIn ? formatDate(booking.checkIn) : null,
      checkOut: booking.checkOut ? formatDate(booking.checkOut) : null,
      price: booking.price,
      roomsBooked: booking.roomsBooked,
      createdAt: formatDate(booking.createdAt),
      updatedAt: formatDate(booking.updatedAt),
    });
  } catch (err) {
    console.error('❌ ERROR in getUserBookingById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    const checkInDateTime = new Date(booking.checkIn);
    checkInDateTime.setHours(10, 0, 0, 0);
    const now = new Date();
    const diffMs = checkInDateTime - now;
    const hoursRemaining = diffMs / (1000 * 60 * 60);

    if (hoursRemaining < 24) {
      return res.status(400).json({
        message: `Cancellation not allowed. Less than 24 hours remain before check-in (10:00 AM)`,
      });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    console.error('❌ ERROR in cancelBooking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
