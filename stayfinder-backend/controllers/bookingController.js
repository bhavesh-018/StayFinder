const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

const formatDate = (date) => {
  const parsed = new Date(date);
  if (isNaN(parsed)) return null; // or throw an error
  return parsed.toISOString().split('T')[0];
};

exports.createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut } = req.body;
    const userId = req.user;

    // Validate required fields
    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Prevent owner from booking their own listing
    if (listing.owner.toString() === userId.toString()) {
      return res.status(403).json({ message: 'You cannot book your own listing' });
    }

    // Calculate number of nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Invalid date range' });
    }

    const totalPrice = nights * listing.price;

    const booking = new Booking({
      listing: listingId,
      user: userId,
      checkIn: formatDate(checkIn),
      checkOut: formatDate(checkOut),
      price: totalPrice
    });

    await booking.save();

    res.status(201).json({
      _id: booking._id,
      status: booking.status,
      listing: booking.listing,
      user: booking.user,
      checkIn: formatDate(booking.checkIn),
      checkOut: formatDate(booking.checkOut),
      totalPrice: booking.totalPrice
    });

  } catch (err) {
    console.error('❌ ERROR in createBooking:', err);
    res.status(500).json({ message: 'Server error' });
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
    if (booking.user.toString() !== req.user.toString()) {
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
      createdAt: formatDate(booking.createdAt),
      updatedAt: formatDate(booking.updatedAt),
    });
  } catch (err) {
    console.error('❌ ERROR in getUserBookingById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Prevent updates after check-in date
    const now = new Date();
    if (new Date(booking.checkIn) <= now) {
      return res.status(400).json({ message: 'Cannot update booking after check-in date' });
    }

    // Fetch associated listing
    const listing = await Listing.findById(booking.listing);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Check listing's availability setting
    if (!listing.isAvailableForUpdate) {
      return res.status(400).json({ message: 'This listing does not allow booking updates' });
    }

    const { checkIn, checkOut } = req.body;

    // Only allow updating checkIn and checkOut
    if (checkIn) booking.checkIn = new Date(checkIn);
    if (checkOut) booking.checkOut = new Date(checkOut);

    await booking.save();

    res.json({
      message: 'Booking updated Successfully',
      booking: {
        ...booking.toObject(),
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        createdAt: formatDate(booking.createdAt),
        updatedAt: formatDate(booking.updatedAt)
      },
    });
  } catch (err) {
    console.error('❌ ERROR in updateBooking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user.toString()) {
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
