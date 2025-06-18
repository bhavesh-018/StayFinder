import { useEffect, useState } from 'react';
import API from '../api/axios';
import Toast from '../components/Toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data);
        setBookings(res.data);
      } catch (err) {
        console.error('Error loading bookings:', err);
      }
    };

    fetchBookings();

    const message = localStorage.getItem('bookingSuccess');
    if (message) {
      setToast(message);
      localStorage.removeItem('bookingSuccess');
    }
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: '900px' }}>
      <h2 className="mb-4 fw-bold">My Bookings</h2>

      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}

      {bookings.length === 0 ? (
        <p className="text-muted">No bookings yet.</p>
      ) : (
        bookings.map((booking, index) => (
          <div key={index} className="card mb-4 shadow-sm">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={Array.isArray(booking.listing?.images) ? booking.listing.images[0] : '/default.jpg'}
                  className="img-fluid rounded-start"
                  alt={booking.listing?.title || 'Listing'}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title mb-1">{booking.listing?.title}</h5>
                  <p className="text-muted mb-1">{booking.listing?.location}</p>
                  <p className="mb-1">
                    <strong>Check In:</strong> {booking.checkIn}
                  </p>
                  <p className="mb-1">
                    <strong>Check Out:</strong> {booking.checkOut}
                  </p>
                  <p className="mb-1">
                    <strong>Rooms:</strong> {booking.roomsBooked}
                  </p>
                  <h6 className="mt-2 text-primary">Total: ₹{booking.price}</h6>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Bookings;
