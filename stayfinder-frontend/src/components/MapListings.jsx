import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Popup } from "react-leaflet";

const MapListings = ({ listings = [] }) => {
  const [geoListings, setGeoListings] = useState([]);
  const [center, setCenter] = useState([20.5937, 78.9629]);
  const navigate = useNavigate();

  // 🎯 Price marker
  const createPriceIcon = (price) =>
    L.divIcon({
      className: "custom-price-marker",
      html: `<div class="price-marker">₹${price}</div>`,
      iconSize: [60, 30],
      iconAnchor: [30, 30],
    });

  // 📍 Load listings with coordinates
  useEffect(() => {
    if (!listings.length) return;

    const valid = listings.filter(
      (l) => l.coordinates?.lat && l.coordinates?.lng
    );

    setGeoListings(valid);

    if (valid.length > 0) {
      setCenter([valid[0].coordinates.lat, valid[0].coordinates.lng]);
    }
  }, [listings]);

  // 📍 Recenter map
  const Recenter = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, 6);
    }, [center]);
    return null;
  };

  return (
    <section style={{ marginTop: "60px", padding: "60px 0" }}>
      <div className="container">
        <div className="explore-header">
          <span className="explore-tag">Nearby stays</span>
          <h2>Find your next stay</h2>
          <p className="explore-desc">
            Handpicked places around you. Tap a price to preview.
          </p>
        </div>

        {/* 🗺️ FULL MAP */}
        <div style={{ height: "600px", borderRadius: "16px", overflow: "hidden" }}>
          <MapContainer
            center={center}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
          >
            <Recenter center={center} />

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {geoListings.map((l) => (
              <Marker 
                key={l._id}
                position={[l.coordinates.lat, l.coordinates.lng]}
                icon={createPriceIcon(l.price)}
              >
                {/* 🔥 CUSTOM POPUP CARD */}
                <Popup>
                  <div
                    className="map-card"
                    onClick={() => navigate(`/listings/${l._id}`)}
                  >
                    <img src={l.images?.[0]} alt={l.title} />
                  <div className="card-info">
                    <h6>{l.title}</h6>
                    <p>₹{l.price}</p>
                  </div>
                </div>
              </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* 🎨 Styles */}
      <style>{`
        .explore-header {
          margin-bottom: 24px;
        }

        .explore-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #ff385c;
          margin-bottom: 6px;
        }

        .explore-header h2 {
          margin: 0;
          font-size: 30px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .explore-desc {
          margin-top: 6px;
          font-size: 14px;
          color: #666;
        }
        .price-marker {
          background: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 12px;
          border: 1px solid #ccc;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .custom-price-marker {
          background: transparent;
          border: none;
        }

        .map-card {
          width: 180px;
          cursor: pointer;
          border-radius: 10px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .map-card img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }

        .card-info {
          padding: 8px;
        }

        .card-info h6 {
          margin: 0;
          font-size: 13px;
        }

        .card-info p {
          margin: 4px 0 0;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
};

export default MapListings;