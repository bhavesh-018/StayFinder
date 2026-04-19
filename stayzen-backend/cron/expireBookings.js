const cron = require('node-cron');
const Booking = require('../models/Booking');

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    const expiredBookings = await Booking.find({
      status: 'PENDING',
      expiresAt: { $lt: now }
    });

    await Booking.updateMany(
        {
            status: 'PENDING',
            expiresAt: { $lt: new Date() }
        },
        {
            $set: { status: 'EXPIRED' }
        }
    );

    if (expiredBookings.length > 0) {
      console.log(`⏳ Expired ${expiredBookings.length} bookings`);
    }

  } catch (err) {
    console.error('CRON ERROR:', err.message);
  }
});