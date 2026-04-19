import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();

    // success message after payment
    const message = localStorage.getItem('bookingSuccess');
    if (message) {
      toast.success(message);
      localStorage.removeItem('bookingSuccess');
    }
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await API.patch(
        `/bookings/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(prev => prev.filter(b => b._id !== id));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const styles = {
  headingWrapper: {
    marginTop: '80px',
    marginBottom: '30px',
    
    display: 'flex',
    flexDirection: 'column',
    alignItems: window.innerWidth < 768 ? 'center' : 'flex-start',
    
    padding: '0 10px'
  },

  heading: {
    fontSize: window.innerWidth < 768 ? '28px' : '42px', // 🔥 responsive
    fontWeight: '700',
    
    background: 'linear-gradient(90deg, #ffffff, #d1d5db)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',

    letterSpacing: '1px',
    margin: 0,
    textAlign: window.innerWidth < 768 ? 'center' : 'left'
  },

  headingLine: {
    marginTop: '10px',
    width: window.innerWidth < 768 ? '60px' : '80px',
    height: '3px',
    borderRadius: '10px',
    background: 'linear-gradient(90deg, #ff5a5f, #f59e0b)'
  }
};

  return (
    <>
      <style>
        {`
        .booking-page {
          min-height: 100vh;
          padding: 40px 20px;
        }

        .booking-card {
          display: flex;
          margin-bottom: 20px;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .booking-card:hover {
          transform: translateY(-5px) scale(1.01);
        }

        .booking-card:hover img {
          transform: scale(1.05);
        }

        .booking-img-wrapper {
          width: 250px;
          overflow: hidden;
        }

        .booking-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.4s;
        }

        .booking-content {
          flex: 1;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .booking-title {
          color: #fff;
          font-size: 20px;
          margin: 0;
        }

        .booking-location {
          font-size: 13px;
          color: #ccc;
        }

        .booking-info {
          display: flex;
          gap: 15px;
          font-size: 13px;
          color: #ddd;
          margin-top: 10px;
        }

        .booking-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .booking-price {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }

        .badge-custom {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          color: #fff;
          font-weight: 500;
        }

        .cancel-btn {
          border: 1px solid #ef4444;
          color: #ef4444;
          background: transparent;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
        }

        .heading {
          color: #fff;
          margin-bottom: 30px;
        }

        @media (max-width: 768px) {
          .booking-card {
            flex-direction: column;
          }

          .booking-img-wrapper {
            width: 100%;
            height: 200px;
          }
        }
        `}
      </style>

      <div className="booking-page container" style={{ maxWidth: '900px' }}>
        <div style={styles.headingWrapper}>
          <h1 style={styles.heading}>
            My Bookings
          </h1>
          <div style={styles.headingLine}></div>
        </div>

        {bookings.length === 0 ? (
          <p className="text-light">No bookings yet.</p>
        ) : (
          bookings.map((b) => {
            const checkInDate = new Date(b.checkIn);
            const now = new Date();
            const canCancel = (checkInDate - now) / (1000 * 60 * 60) > 24;

            return (
              <div
                key={b._id}
                className="booking-card"
                onClick={() => {
                  if (b.status === 'PENDING') {
                    navigate(`/payment/${b._id}`);
                  }
                }}
              >
                <div className="booking-img-wrapper">
                  <img
                    src={Array.isArray(b.listing?.images)
                      ? b.listing.images[0]
                      : b.listing?.images}
                    alt={b.listing?.title}
                    className="booking-img"
                  />
                </div>

                <div className="booking-content">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4 className="booking-title">{b.listing?.title}</h4>
                      <p className="booking-location">{b.listing?.location}</p>
                    </div>

                    {canCancel && b.status === 'CONFIRMED' && (
                      <button
                        className="cancel-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(b._id);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="booking-info">
                    <span>Check-in: {b.checkIn}</span>
                    <span>Check-out: {b.checkOut}</span>
                    <span>Rooms: {b.roomsBooked}</span>
                  </div>

                  <div className="booking-footer">
                    <div className="booking-price">₹{b.price}</div>

                    <span
                      className="badge-custom"
                      style={{
                        background:
                          b.status === 'CONFIRMED'
                            ? '#22c55e'
                            : b.status === 'PENDING'
                            ? '#f59e0b'
                            : '#ef4444',
                      }}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Bookings;