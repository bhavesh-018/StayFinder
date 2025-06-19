import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const ListingsSection = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get('/listings');
        const sorted = [...res.data]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // sort by date descending
        .slice(0, 3);

      setListings(sorted);
      } catch (err) {
        console.error('Error fetching listings:', err);
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h2 className="heading">Recently Featured Stays</h2>
        <div className="row" style={{marginTop: '70px'}}>
          {listings.map(listing => (
            <div className="col-md-4" key={listing._id}>
              <div className="card">
                <img
                  src={Array.isArray(listing.images) ? listing.images[0] : listing.images}
                  className="listing-image"
                />

                <div className="card-body">
                  <h5>{listing.title}</h5>
                  <p>{listing.location}</p>
                  <p>₹{listing.price} / night</p>
                  <Link to={`/listings/${listing._id}`}>
                  <button className="btn btn-sm btn-outline-primary">View</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListingsSection;
