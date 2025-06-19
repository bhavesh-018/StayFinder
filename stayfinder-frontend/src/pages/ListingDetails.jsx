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
  const user = JSON.parse(localStorage.getItem('user'));
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
        <div className="main-image position-relative" onClick={() => openLightbox(0)}>
  <img src={listing.images[0]} alt="Main" className="img-fluid w-100 rounded" />

  {listing.images.length > 3 && (
    <button
      className="see-all-btn btn btn-light position-absolute"
      style={{
        bottom: '15px',
        right: '15px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        border: 'none',
        fontWeight: '500',
        padding: '6px 12px',
        borderRadius: '999px',
        zIndex: 2,
      }}
      onClick={(e) => {
        e.stopPropagation(); // prevent parent div from triggering
        openLightbox(0);
      }}
    >
      See all photos
    </button>
  )}
</div>
        <div className="side-images">
          {listing.images.slice(1, 4).map((img, idx) => (
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
  <div className="card border-0 shadow-sm p-4 rounded-4 bg-light" style={{marginLeft: '60px', width: '93%'}}>
    {/* Title & Location */}
    <div className="mb-3">
      <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '26px' }}>
        {listing.title}
      </h2>
      <p className="text-muted mb-0" style={{ fontSize: '15px' }}>
        <i className="fa fa-map-marker-alt text-danger me-2"></i>
        {listing.location}
      </p>
    </div>
    <div className="mt-3 d-flex flex-wrap gap-2">
  <span className="badge bg-light text-success border border-success px-3 py-2 fw-semibold">
    <i className="fa fa-check-circle me-1"></i> Free Cancellation
  </span>
  <span className="badge bg-light text-info border border-info px-3 py-2 fw-semibold">
    <i className="fa fa-wifi me-1"></i> Free Wi-Fi
  </span>
  <span className="badge bg-light text-secondary border border-secondary px-3 py-2 fw-semibold">
    <i className="fa fa-utensils me-1"></i> Breakfast Included
  </span>
  <span className="badge bg-light text-warning border border-warning px-3 py-2 fw-semibold">
    <i className="fa fa-concierge-bell me-1"></i> 24/7 Front Desk
  </span>
</div>


    {/* Divider */}
    <hr className="my-4" />

    {/* Description */}
    <p className="text-dark" style={{ fontSize: '16px', lineHeight: '1.8' }}>
      {listing.description}
    </p>

    {/* Perks / Tags */}
    
  </div>
</div>

        {/* Right: Ratings + Pricing */}
        <div className="col-md-5">
        <div className="card shadow-sm p-4" style={{width: '90%'}}>
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
          <h5 className="mb-1"><span className="text-primary">₹{listing.price}</span> / night</h5>
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Includes taxes & fees</p>
        </div>

        {user && user._id === listing.owner?._id ? (
  <div className="text-success fw-semibold text-center mt-2">
     <span class="badge badge-pill badge-success fw-semibold"  style={{ fontSize: '1rem', padding: '10px 20px', borderRadius: '999px' }}>You own this listing</span></div>
) : (
  <button
    className="btn btn-primary w-100 mt-2"
    onClick={() => setShowModal(true)}
  >
    Book Now
  </button>
)}
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