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
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Average";
    return "Poor";
  };
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const visibleAmenities = showAllAmenities ? listing?.amenities : listing?.amenities?.slice(0, 10);

  const amenityConfig = {
    "Free Wi-Fi": {
      icon: "fa-wifi",
      color: "text-info",
      bg: "bg-primary-subtle"
    },
    "Air Conditioning": {
      icon: "fa-snowflake-o",
      color: "text-info",
      bg: "bg-info-subtle"
    },
    "Heating": {
      icon: "fa-fire",
      color: "text-danger",
      bg: "bg-danger-subtle"
    },
    "Parking": {
      icon: "fa-car",
      color: "text-secondary",
      bg: "bg-secondary-subtle"
    },
    "Free Cancellation": {
      icon: "fa-check-circle",
      color: "text-success",
      bg: "bg-success-subtle"
    },
    "Breakfast Included": {
      icon: "fa-utensils",
      color: "text-warning",
      bg: "bg-warning-subtle"
    },
    "24/7 Front Desk": {
      icon: "fa-bell",
      color: "text-warning",
      bg: "bg-warning-subtle"
    },
    "Swimming Pool": {
      icon: "fa-life-ring",
      color: "text-primary",
      bg: "bg-primary-subtle"
    },
    "Gym": {
      icon: "fa-heartbeat",
      color: "text-danger",
      bg: "bg-danger-subtle"
    },
    "Laundry Service": {
      icon: "fa-refresh",
      color: "text-info",
      bg: "bg-info-subtle"
    },
    "Room Service": {
      icon: "fa-bell",
      color: "text-warning",
      bg: "bg-warning-subtle"
    },
    "Pet Friendly": {
      icon: "fa-paw",
      color: "text-success",
      bg: "bg-success-subtle"
    },
    "Airport Shuttle": {
      icon: "fa-bus",
      color: "text-info",
      bg: "bg-info-subtle"
    },
    "Restaurant": {
      icon: "fa-utensils",
      color: "text-secondary",
      bg: "bg-secondary-subtle"
    },
    "Bar": {
      icon: "fa-glass-martini",
      color: "text-danger",
      bg: "bg-danger-subtle"
    },
    "Spa": {
      icon: "fa-leaf",
      color: "text-success",
      bg: "bg-success-subtle"
    },
    "Elevator": {
      icon: "fa-arrow-up",
      color: "text-secondary",
      bg: "bg-secondary-subtle"
    },
    "Wheelchair Accessible": {
      icon: "fa-wheelchair",
      color: "text-primary",
      bg: "bg-primary-subtle"
    },
    "TV": {
      icon: "fa-tv",
      color: "text-secondary",
      bg: "bg-secondary-subtle"
    },
    "Kitchen": {
      icon: "fa-utensils",
      color: "text-warning",
      bg: "bg-warning-subtle"
    },
    "Balcony": {
      icon: "fa-building",
      color: "text-info",
      bg: "bg-info-subtle"
    },
    "Sea View": {
      icon: "fa-tint",
      color: "text-primary",
      bg: "bg-primary-subtle"
    },
    "Mountain View": {
      icon: "fa-tree",
      color: "text-success",
      bg: "bg-success-subtle"
    },
    "Workspace": {
      icon: "fa-desktop",
      color: "text-dark",
      bg: "bg-light"
    },
    "Security": {
      icon: "fa-shield",
      color: "text-danger",
      bg: "bg-danger-subtle"
    },
    "Housekeeping": {
      icon: "fa-home",
      color: "text-secondary",
      bg: "bg-secondary-subtle"
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/listings/${id}?page=${page}&limit=3`);
        setListing(res.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError('Failed to load listing.');
      }
    };
    fetchListing();
  }, [id, page]);

  useEffect(() => {
    if (showAllAmenities) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAllAmenities]);

  const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

  const handleBooking = async ({ checkIn, checkOut, rooms }) => {
    try {
      const res = await API.post(
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
      const bookingId = res.data._id;

    // 🔥 redirect to payment page
    navigate(`/payment/${bookingId}`);
    } catch (err) {
      setToast(err.response?.data?.message || 'Booking failed');
      console.log(err);
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.rating || !reviewData.comment.trim()) {
      return alert("Please add rating and comment");
    }
    try {
      await API.post(
        `/listings/${id}/reviews`,
        reviewData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // refresh listing
      const res = await API.get(`/listings/${id}`);
      setListing(res.data);

      setReviewData({ rating: 5, comment: '' });

    } catch (err) {
      console.log(err);
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  if (error) return <div className="container mt-5">{error}</div>;
  if (!listing) return <div className="container mt-5">Loading...</div>;

  return (
    <>
<style>{`
.custom-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.custom-backdrop {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
}

.custom-modal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  background: #111;
  border-radius: 16px;
  padding: 20px;
  z-index: 10000;
}

.custom-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
@media (max-width: 768px) {

  /* Fix image grid */
  .image-grid {
    grid-template-columns: 1fr !important;
  }

  .side-images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: none !important;
    gap: 6px;
  }

  .side-images img {
    height: 90px !important;
  }

  /* Remove left spacing */
  .listing-details-page .col-md-7 .card {
    margin-left: 0 !important;
    width: 100% !important;
  }

  /* Reviews card fix */
  .listing-details-page .col-md-7 .card .card {
    margin-left: 0 !important;
    width: 100% !important;
  }

  /* Right section full width */
  .listing-details-page .col-md-5 .card {
    width: 100% !important;
  }

  /* Stack layout */
  .listing-details-bottom .row {
    flex-direction: column;
  }

  /* Booking button full width */
  .listing-details-page button.btn-primary {
    width: 100%;
  }

  /* Reduce title size slightly */
  .listing-details-page h2 {
    font-size: 20px !important;
  }

  /* Reduce padding */
  .listing-details-page .card {
    padding: 16px !important;
  }

}
`}</style>
    <div className="container listing-details-page" style={{ paddingTop: '100px' }}>
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

    {/* Divider */}
    <hr className="my-4" />

    {/* Description */}
    <p className="text-dark" style={{ fontSize: '16px', lineHeight: '1.8' }}>
      {listing.description}
    </p>

    {/* Reviews Section */}
    <div className="card border-0 shadow-sm p-4 rounded-4 bg-light mt-4" style={{marginLeft: '20px', width: '93%'}}>
      <h4 className="fw-bold mb-3">Reviews</h4>

      {listing.reviews && listing.reviews.length > 0 ? (
        listing.reviews.map((review, idx) => (
          <div key={idx} className="mb-3 border-bottom pb-2">
            <div className="d-flex justify-content-between">
              <strong>{review.user?.name || "User"}</strong>
              <span className="text-warning">
                ⭐ {review.rating}
              </span>
            </div>
            <p className="mb-1">{review.comment}</p>
            <small className="text-muted">
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          </div>
        ))
      ) : (
        <p className="text-muted">No reviews yet.</p>
      )}

      <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
          >
            Prev
          </button>

          <span className="align-self-center">
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-outline-primary"
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
          >
            Next
          </button>
      </div>

      <hr/>
      {user && (
      <div className="mt-4">
        <h5>Add Review</h5>

        <div className="mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: 'pointer',
            fontSize: '22px',
            color: star <= reviewData.rating ? '#ffc107' : '#e4e5e9',
          }}
          onClick={() =>
            setReviewData({ ...reviewData, rating: star })
          }
        >
          ★
        </span>
      ))}
    </div>
    <textarea
      className="form-control mb-2"
      placeholder="Write your review..."
      value={reviewData.comment}
      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
    />

    <button className="btn btn-success" onClick={handleReviewSubmit}>
      Submit Review
    </button>
  </div>
)}
</div>



    {/* Perks / Tags */}
    
  </div>
</div>

        {/* Right: Ratings + Pricing */}
        <div className="col-md-5">
          <div className="card shadow-sm p-4" style={{width: '90%'}}>
            <div className="d-flex align-items-center gap-3 mb-3"  style={{ gap: '15px' }}>
              <div className="d-flex align-items-center justify-content-center fw-bold"
                style={{
                  backgroundColor: '#f4b35e',
                  color: '#fff',
                  borderRadius: '8px',
                  width: '50px',
                  height: '50px',
                  fontSize: '18px'
                }}>
                {listing.reviews?.length > 0 ? listing.averageRating.toFixed(1) : "New"}
              </div>
              <div>
                <div className="fw-semibold">
                  {listing.reviews?.length > 0 ? getRatingLabel(listing.averageRating) : "No ratings yet"}
                </div>
                {listing.reviews && listing.reviews.length > 0 ? (
                  <div className="text-muted" style={{ fontSize: '14px' }}>
                    Based on {listing.reviews.length} review{listing.reviews.length > 1 ? 's' : ''}
                  </div>
                ) : (
                  <div className="text-muted" style={{ fontSize: '14px' }}>
                    No reviews yet
                  </div>
                )}
              </div>
          </div>

        <hr />
        <div className="mb-3">
          <h5 className="mb-1"><span className="text-primary">₹{listing.price}</span> / night</h5>
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Includes taxes & fees</p>
        </div>

        {user && user._id === listing.owner?._id ? (
  <div className="text-success fw-semibold text-center mt-2">
    <span
      className="badge badge-pill badge-success fw-semibold"
      style={{
        fontSize: '1rem',
        padding: '10px 20px',
        borderRadius: '999px'
      }}
    >
      You own this listing
    </span>
  </div>
) : (
  <button
    className="btn btn-primary w-100 mt-2"
    onClick={() => {
      if (!token) {
        navigate('/login', {
          state: {
            redirectTo: `/listings/${id}`,
            toast: 'Please login to continue booking'
          }
        });
        return;
      }

      setShowModal(true);
    }}
  >
    Book Now
  </button>
)}
      </div>
      <div
        className="card border-0 shadow-sm mt-4"
        style={{
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(10px)'
        }}
        >
          <div className="p-3">
            <h6 className="fw-bold mb-3">Amenities</h6>
            <div className="d-flex flex-column gap-2">
              {visibleAmenities?.map((amenity, index) => {
                const config = amenityConfig[amenity] || {
                  icon: "fa-check",
                  color: "text-light"
                };

                return (
                  <div
                    key={index}
                    className="amenity-row d-flex align-items-center justify-content-between px-3 py-2"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="amenity-icon-box">
                        <i className={`fa ${config.icon} ${config.color}`}></i>
                      </div>
                      <span className="amenity-text">{amenity}</span>
                    </div>
                    <i className="fa fa-check text-success small"></i>
                  </div>
                );
              })}
              {listing.amenities?.length > 10 && (
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={() => setShowAllAmenities(true)}
                    >
                      View all amenities
                    </button>
                  </div>
                )}
            </div>
          </div>
      </div>
    </div>
  </div>
</div>

{showAllAmenities && (
  <div className="custom-modal-wrapper">
    {/* BACKDROP */}
    <div
      className="custom-backdrop"
      onClick={() => setShowAllAmenities(false)}
    />
    {/* MODAL */}
    <div className="custom-modal-container">
      {/* HEADER */}
      <div className="custom-modal-header">
        <h5>All Amenities ({listing?.amenities?.length || 0})</h5>
        <button onClick={() => setShowAllAmenities(false)}>✕</button>
      </div>
      {/* BODY */}
      <div className="custom-modal-body">
        <div className="row g-3 mx-0">
          {listing?.amenities?.map((amenity, index) => {
            const config = amenityConfig[amenity] || {
              icon: "fa-check",
              color: "text-light"
            };
            return (
              <div key={index} className="col-md-6">
                <div className="amenity-modal-item d-flex align-items-center p-3" style={{gap: '15px'}}>
                  <div className="amenity-icon-box">
                    <i className={`fa ${config.icon} ${config.color}`}></i>
                  </div>
                  <span>{amenity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
)}
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
      maxRooms={listing.totalRooms} 
      />
    </div>
    </>
  );
  
};

export default ListingDetails;