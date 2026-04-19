import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HostBookings = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/bookings/host",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "100px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* GLASS CONTAINER */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          padding: "20px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "600",
            marginBottom: "16px",
            color: "#fff",
          }}
        >
          Bookings
        </h1>

        {bookings.length === 0 ? (
          <div style={{ textAlign: "center", color: "#ddd" }}>
            No bookings yet
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {bookings.map((b) => (
              <div
                key={b._id}
                style={{
                  width: "220px", // 🔥 FIXED SMALL CARD WIDTH
                  padding: "10px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {b.listing?.title}
                </div>

                <div style={{ opacity: 0.8 }}>
                  {b.user?.name}
                </div>

                <div style={{ opacity: 0.8 }}>
                  {b.checkIn} → {b.checkOut}
                </div>

                <div style={{ opacity: 0.8 }}>
                  {b.roomsBooked} room
                </div>

                <div style={{ fontWeight: "600", marginTop: "4px" }}>
                  ₹{b.price}
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "11px",
                    padding: "2px 6px",
                    borderRadius: "999px",
                    display: "inline-block",
                    background:
                      b.status === "CONFIRMED"
                        ? "rgba(34,197,94,0.2)"
                        : b.status === "PENDING"
                        ? "rgba(234,179,8,0.2)"
                        : "rgba(239,68,68,0.2)",
                  }}
                >
                  {b.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostBookings;