import { useEffect, useState } from 'react';
import API from '../api/axios';
import StyledListingCard from '../components/StyledListingCard';
import { useLocation } from 'react-router-dom';
import AvailabilityForm from '../components/AvailabilityForm';

const ListingsPage = () => {
  const [listings, setListings] =
    useState([]);

  const [filtered, setFiltered] =
    useState([]);

  const location = useLocation();

  const filters =
    location.state || {};

  const searchTerm =
    filters.search || '';

  const searchLocation =
    filters.location || '';

  const checkIn =
    filters.checkIn || null;

  const checkOut =
    filters.checkOut || null;

  const guests =
    filters.guests || 1;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res =
          await API.get('/listings');

        setListings(res.data);

        let matched =
          res.data;

        // location filter
        if (searchLocation) {
          matched =
            matched.filter(
              (listing) =>
                listing.location
                  .toLowerCase()
                  .includes(
                    searchLocation.toLowerCase()
                  )
            );
        }

        // search filter
        if (searchTerm) {
          matched =
            matched.filter(
              (listing) =>
                listing.title
                  .toLowerCase()
                  .includes(
                    searchTerm.toLowerCase()
                  ) ||
                listing.description
                  .toLowerCase()
                  .includes(
                    searchTerm.toLowerCase()
                  )
            );
        }

        // guest filter
        if (guests) {
          matched =
            matched.filter(
              (listing) =>
                listing.totalRooms >=
                Number(guests)
            );
        }

        setFiltered(matched);
      } catch (error) {
        console.error(
          'Error fetching listings:',
          error
        );
      }
    };

    fetchListings();
  }, [
    searchLocation,
    searchTerm,
    guests
  ]);

  return (
    <div
      className="container mt-5"
      style={{
        marginTop: '140px'
      }}
    >
      <div className="row">
        {/* Left: Filters */}
        <div
          className="col-lg-4 mb-4"
          style={{
            marginTop: '95px'
          }}
        >
          <AvailabilityForm
            initialCity={
              searchLocation
            }
            initialCheckIn={
              checkIn
            }
            initialCheckOut={
              checkOut
            }
            initialGuests={
              guests
            }
            fromListingsPage={
              true
            }
          />
        </div>

        {/* Right: Listings */}
        <div
          className="col-lg-8"
          style={{
            marginTop: '40px'
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="fw-bold text-light">
              Showing results for{' '}
              <span className="text-primary">
                {searchTerm
                  ? `"${searchTerm}"`
                  : searchLocation
                  ? `"${searchLocation}"`
                  : 'All Listings'}
              </span>
            </h4>
          </div>

          {filtered.length > 0 ? (
            filtered.map(
              (
                listing,
                index
              ) => (
                <StyledListingCard
                  key={index}
                  {...listing}
                />
              )
            )
          ) : (
            <div>
              <hr className="listing-separator" />
              <h2 className="text-light">
                No listings found.
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;