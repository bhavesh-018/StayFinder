import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import '../ListingDetails.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import BookingModal from '../components/BookingModal';

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        setError('Failed to load listing.');
      }
    };
    fetchListing();
  }, [id]);

  const formatDate = (date) => {
  return date.toISOString().split('T')[0];  // "2025-06-18"
};

  const handleBooking = async ({ checkIn, checkOut, rooms }) => {
    try {
      await API.post(
        '/bookings',
        {
          listingId: id,
          checkIn : formatDate(checkIn),
          checkOut: formatDate(checkOut),
          roomsBooked: rooms
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      localStorage.setItem('bookingSuccess', 'Your booking was successful!');
      navigate('/bookings');
    } catch (err) {
      setToast(err.response?.data?.message || 'Booking failed');
      console.log(err);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  if (error) return <div className="container mt-5">{error}</div>;
  if (!listing) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container listing-details-page" style={{marginTop: '100px'}}>
      {/* Image Grid */}
      <div className="image-grid mb-4">
        <div className="main-image" onClick={() => openLightbox(0)}>
          <img src={listing.images[0]} alt="Main" />
          {listing.images.length > 5 && (
            <div className="see-all" onClick={() => openLightbox(0)}>
              See all photos
            </div>
          )}
        </div>
        <div className="side-images">
          {listing.images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="thumb" onClick={() => openLightbox(idx + 1)}>
              <img src={img} alt={`Thumb ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>

     {/* Listing Info, Ratings & Booking CTA */}
        <div className="listing-details-bottom mb-5">
            <div className="row">
        {/* Left: Title, Location, Description */}
        <div className="col-md-7">
        <h2 className="fw-bold mb-2">{listing.title}</h2>
        <p className="text-muted mb-2"><i className="fa fa-map-marker-alt me-2"></i>{listing.location}</p>
        <p>{listing.description}</p>
        </div>

        {/* Right: Ratings + Pricing */}
        <div className="col-md-4">
        <div className="card shadow-sm p-3" style={{marginLeft:'60px'}}>
            <div className="d-flex align-items-center gap-3 mb-3">
  <div className="bg-primary text-white rounded p-2 px-3 fw-bold" style={{ fontSize: '18px', marginRight: '10px' }}>
    8.1
  </div>
  <div>
    <div className="fw-semibold">Excellent</div>
    <div className="text-muted" style={{ fontSize: '14px' }}>
      Based on {listing.reviews?.length || 4234} reviews
    </div>
  </div>
</div>

        <hr />

        <div className="mb-3">
          <h5 className="mb-1">From <span className="text-primary">₹{listing.price}</span> / night</h5>
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Includes taxes & fees</p>
        </div>

        <button className="btn btn-primary w-100 mt-2" onClick={() => setShowModal(true)}>Book Now</button>
      </div>
    </div>
  </div>
</div>


      {/* Lightbox Integration */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={currentImageIndex}
          slides={listing.images.map((img) => ({ src: img }))}
        />
      )}
      <BookingModal
      show={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleBooking}    
      />
    </div>
  );
  
};

export default ListingDetails;