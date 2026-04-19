import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {Toaster, toast} from 'react-hot-toast';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await API.get(`/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setBooking(res.data);
      } catch {
        toast.error("Failed to load booking");
      }
    };

    fetchBooking();
  }, [id]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const { data: order } = await API.post(
        '/bookings/create-order',
        {
          amount: booking.price,
          bookingId: booking._id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "StayFinder",
        order_id: order.id,

        handler: async function (response) {
          try {
            await API.post('/bookings/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Booking Successful");
            navigate('/bookings');
          } catch {
            toast.error("Verification failed");
          }
        }
      };

      new window.Razorpay(options).open();

    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return <p className="text-light text-center mt-5">Loading...</p>;

  const nights = Math.ceil(
    (new Date(booking.checkOut) - new Date(booking.checkIn)) /
    (1000 * 60 * 60 * 24)
  );

  const subtotal = booking.listing.price * nights * booking.roomsBooked;
  const serviceFee = 500;
  const total = subtotal + serviceFee;

  return (
  <>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          zIndex: 9999
        }
      }}
    />
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.container}>
        <div style={styles.imageWrapper}>
          <img
            src={booking.listing.images?.[0]}
            alt="listing"
            style={styles.image}
          />
        </div>

        {/* RIGHT DETAILS */}
        <div style={styles.details}>
          <h2 style={styles.title}>{booking.listing.title}</h2>
          <p style={styles.location}>{booking.listing.location}</p>

          <span style={styles.badge}>Pending Payment</span>

          <div style={styles.divider} />

          <div style={styles.infoRow}>
            <span>Check-in</span>
            <span>{booking.checkIn}</span>
          </div>

          <div style={styles.infoRow}>
            <span>Check-out</span>
            <span>{booking.checkOut}</span>
          </div>

          <div style={styles.infoRow}>
            <span>Rooms</span>
            <span>{booking.roomsBooked}</span>
          </div>

          <div style={styles.divider} />

          {/* PRICE */}
          <div style={styles.infoRow}>
            <span>₹{booking.listing.price} × {nights} × {booking.roomsBooked}</span>
            <span>₹{subtotal}</span>
          </div>

          <div style={styles.infoRow}>
            <span>Service Fee</span>
            <span>₹{serviceFee}</span>
          </div>

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <span>Total</span>
            <span style={styles.total}>₹{total}</span>
          </div>

          <button
            style={styles.button}
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          <p style={styles.note}>
            Secure your booking by completing payment now.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },


  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.4)'
  },

  container: {
    position: 'relative',
    display: 'flex',
    width: '850px',
    maxWidth: '95%',
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#fff',
    zIndex: 2
  },

  imageWrapper: {
    flex: 1,
    display: 'block'
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

  details: {
    flex: 1,
    padding: '20px', // 🔥 reduced height
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },

  title: {
    fontSize: '22px',
    fontWeight: '600'
  },

  location: {
    fontSize: '13px',
    color: '#777'
  },

  badge: {
    background: '#fff3cd',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    width: 'fit-content'
  },

  divider: {
    height: '1px',
    background: '#eee',
    margin: '6px 0'
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px'
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: '600'
  },

  total: {
    color: 'green'
  },

  button: {
    marginTop: '12px',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    background: '#ff5a5f',
    color: '#fff',
    cursor: 'pointer'
  },

  note: {
    fontSize: '11px',
    color: '#888'
  }
};

export default PaymentPage;