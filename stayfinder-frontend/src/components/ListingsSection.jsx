import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const ListingsSection = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get('/listings');
        setListings(res.data);
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
        <div className="row">
          {listings.map(listing => (
            <div className="col-md-4" key={listing._id}>
              <div className="card">
                <img src={listing.image} className="card-img-top" alt={listing.title} />
                <div className="card-body">
                  <h5>{listing.title}</h5>
                  <p>{listing.location}</p>
                  <p>₹{listing.price} / night</p>
                  <button className="btn btn-sm btn-outline-primary">View</button>
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
