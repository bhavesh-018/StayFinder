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
  <h2 style={{marginTop: '100px'}} className='text-white fw-semibold'>
    My Bookings</h2>
  <hr className="listing-separator" />
  {bookings.length === 0 ? (
    <p>No bookings found.</p>
  ) : (
    bookings.map((b) => {
  const checkInDate = new Date(b.checkIn);
  const now = new Date();
  const canCancel = (checkInDate - now) / (1000 * 60 * 60) > 24; // > 24 hours

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await API.patch(`/bookings/${b._id}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(prev => prev.filter(booking => booking._id !== b._id));
      setToast('Booking cancelled successfully');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Cancel failed:', err);
      setToast('Failed to cancel booking');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div key={b._id} className="card mb-4 shadow-sm">
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={Array.isArray(b.listing?.images) ? b.listing.images[0] : b.listing?.images}
            className="img-fluid rounded-start booking-card-img"
            alt={b.listing?.title}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
  <h5 className="card-title">{b.listing?.title}</h5>
  
  {canCancel && b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
    <button
      className="btn btn-outline-danger btn-sm"
      style={{ fontSize: '13px', padding: '4px 10px' }}
      onClick={() => handleCancel(b._id)}
    >
      Cancel
    </button>
  )}
</div>
            <p className="text-muted mb-2">{b.listing?.location}</p>
            <p className="mb-1"><strong>Check-in:</strong> {b.checkIn}</p>
            <p className="mb-1"><strong>Check-out:</strong> {b.checkOut}</p>
            <p className="mb-1"><strong>Rooms:</strong> {b.roomsBooked}</p>
            <p className="mb-1"><strong>Total:</strong> ₹{b.price}</p>
            <div className='text-white'>
            <span className={`badge bg-${b.status === 'CANCELLED' ? 'danger' :
                              b.status === 'COMPLETED' ? 'secondary' :
                              b.status === 'ACTIVE' ? 'success' : 'warning'}`} style={{ fontSize: '1rem', padding: '10px 20px', borderRadius: '999px'}}>{b.status}</span>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
})

  )}
</div>

      )}
    </div>
    </>
  );
};

export default Bookings;
