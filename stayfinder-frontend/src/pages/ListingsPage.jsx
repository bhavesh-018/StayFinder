// ListingsPage.jsx
import { useEffect, useState } from 'react';
import API from '../api/axios';
import StyledListingCard from '../components/StyledListingCard';
import { useLocation } from 'react-router-dom';
import AvailabilityForm from '../components/AvailabilityForm';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const searchLocation = params.get('location') || '';
  const checkIn = params.get('checkIn') ? new Date(params.get('checkIn')) : null;
  const checkOut = params.get('checkOut') ? new Date(params.get('checkOut')) : null;
  const guests = params.get('guests') || 1;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get('/listings');
        setListings(res.data);

        if (searchLocation) {
          const matched = res.data.filter(listing =>
            listing.location.toLowerCase().includes(searchLocation.toLowerCase())
          );
          setFiltered(matched);
        } else {
          setFiltered(res.data);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, [searchLocation]);

  return (
    <div className="container mt-5" style={{ marginTop: '140px' }}>
      <div className="row">
        {/* Left: Availability Form */}
        <div className="col-lg-4 mb-4" style={{marginTop: '95px'}}>
          <AvailabilityForm
            initialCity={searchLocation}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={guests}
            fromListingsPage={true}
          />
        </div>

        {/* Right: Listings */}
        <div className="col-lg-8" style={{marginTop: '40px'}}>
          <div className="d-flex align-items-center justify-content-between mb-4">
  <h4 className="fw-bold text-light">
    Showing results for{' '}
    <span className="text-primary">
      {searchLocation ? `"${searchLocation}"` : 'All Listings'}
    </span>
  </h4>
</div>
          {filtered.length > 0 ? (
            filtered.map((listing, index) => (
              <StyledListingCard key={index} {...listing} />
            ))
          ) : (
            
            <p> 
              <hr className="listing-separator" />
              <h2 className='text-light'>No listings found.</h2>
              
              </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;