import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

const ListingsSection = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get("/listings");

        const sorted = [...res.data]
          .sort((a, b) => b.averageRating - a.averageRating) // 🔥 sort by rating
          .slice(0, 4); // show top 4

        setListings(sorted);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="top-section">
      <div className="container">

        {/* 🔥 Premium Header */}
        <div className="top-header">
          <span className="top-tag">Guest favorites</span>
          <h2>Top rated stays</h2>
          <p className="top-sub">
            Loved by guests for comfort, location, and experience
          </p>
        </div>

        <div className="row mt-4">
          {listings.map((listing) => (
            <div className="col-md-3 col-sm-6 mb-4" key={listing._id}>
              <div className="top-card">
                <img
                  src={listing.images?.[0]}
                  alt={listing.title}
                />

                <div className="top-card-body">
                  <h6>{listing.title}</h6>
                  <p className="location">{listing.location}</p>

                  <div className="card-bottom">
                    <span className="price">₹{listing.price}/night</span>
                    <span className="rating">⭐ {listing.averageRating}</span>
                  </div>

                  <Link to={`/listings/${listing._id}`}>
                    <button className="view-btn">View</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 🎨 Styles */}
      <style>{`
        .top-section {
          padding: 60px 0;
          background: #fafafa;
        }

        .top-header {
          margin-bottom: 20px;
        }

        .top-tag {
          font-size: 11px;
          font-weight: 600;
          color: #ff385c;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .top-header h2 {
          margin: 5px 0;
          font-size: 28px;
          font-weight: 600;
        }

        .top-sub {
          color: #666;
          font-size: 14px;
        }

        .top-card {
          border-radius: 16px;
          overflow: hidden;
          background: white;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          transition: 0.3s;
        }

        .top-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }

        .top-card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .top-card-body {
          padding: 12px;
        }

        .top-card-body h6 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .location {
          font-size: 12px;
          color: #777;
        }

        .card-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          font-size: 13px;
        }

        .price {
          font-weight: 600;
        }

        .rating {
          color: #ff385c;
        }

        .view-btn {
          margin-top: 8px;
          width: 100%;
          padding: 6px;
          border-radius: 8px;
          border: none;
          background: #ff385c;
          color: white;
          font-size: 13px;
          cursor: pointer;
        }

        .view-btn:hover {
          background: #e11d48;
        }

        /* 📱 Mobile */
        @media (max-width: 768px) {
          .top-card img {
            height: 140px;
          }

          .top-header h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
};

export default ListingsSection;