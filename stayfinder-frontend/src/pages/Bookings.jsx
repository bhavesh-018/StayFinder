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
    <>
    <style>
      {
        `.booking-card-img {
  height: 100%;
  object-fit: cover;
}
  .listing-separator {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 32px 0;
  width: 100%;
}
        `
      }
    </style>
    <div className="container mt-5" style={{ maxWidth: '900px'}}>
      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}

      {bookings.length === 0 ? (
        <p className="text-muted">No bookings yet.</p>
      ) : (
        <div className="container mt-5" >
  <h2 style={{marginTop: '100px'}}>
    My Bookings</h2>
  <hr className="listing-separator" />
  {bookings.length === 0 ? (
    <p>No bookings found.</p>
  ) : (
    bookings.map((b) => (
      <div key={b._id} className="card mb-4 shadow-sm" >
        <div className="row g-0">
          {/* Left: Image */}
          <div className="col-md-4">
            <img
              src={Array.isArray(b.listing?.images) ? b.listing.images[0] : b.listing?.images}
              className="img-fluid rounded-start booking-card-img"
              alt={b.listing?.title}
              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            />
          </div>

          {/* Right: Info */}
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{b.listing?.title}</h5>
              <p className="text-muted mb-2">{b.listing?.location}</p>
              <p className="mb-1"><strong>Check-in:</strong> {b.checkIn}</p>
              <p className="mb-1"><strong>Check-out:</strong> {b.checkOut}</p>
              <p className="mb-1"><strong>Rooms:</strong> {b.roomsBooked}</p>
              <p className="mb-1"><strong>Total:</strong> ₹{b.price}</p>
              <span class="badge badge-pill badge-success">Active</span>
            </div>
          </div>
        </div>
      </div>
    ))
  )}
</div>

      )}
    </div>
    </>
  );
};

export default Bookings;
