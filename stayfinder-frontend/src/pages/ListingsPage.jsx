import { useEffect, useState } from 'react';
import API from '../api/axios'; // Make sure this points to your axios config
import StyledListingCard from '../components/StyledListingCard';
import { useLocation } from 'react-router-dom';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchLocation = params.get('location');

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
    <div style={{ marginTop: '180px' }}>
      <div className="container mt-5">
        <h2>Results for: {searchLocation || 'All Listings'}</h2>
        {filtered.length > 0 ? (
          filtered.map((listing, index) => (
            <StyledListingCard key={index} {...listing} />
          ))
        ) : (
          <p>No listings found.</p>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
