import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    totalRooms: 1,
    amenities: [],
  });
  const AMENITIES_LIST = [
    "Free Wi-Fi",
    "Air Conditioning",
    "Heating",
    "Parking",
    "Free Cancellation",
    "Breakfast Included",
    "24/7 Front Desk",
    "Swimming Pool",
    "Gym",
    "Laundry Service",
    "Room Service",
    "Pet Friendly",
    "Airport Shuttle",
    "Restaurant",
    "Bar",
    "Spa",
    "Elevator",
    "Wheelchair Accessible",
    "TV",
    "Kitchen",
    "Balcony",
    "Sea View",
    "Mountain View",
    "Workspace",
    "Security",
    "Housekeeping"
  ];

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await API.get(`/listings/${id}`);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          location: res.data.location,
          totalRooms: res.data.totalRooms || 1,
          amenities: res.data.amenities || [],
        });
      } catch (err) {
        console.log("Listing ID:", id);
        setError('Failed to load listing');
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await API.put(
        `/listings/${id}`,
        {
          ...formData,
          price: Number(formData.price),
          totalRooms: Number(formData.totalRooms)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      navigate('/my-listings' , {
  state: { toast: { type: 'success', message: 'Listing Updated successfully!' } }
});
      
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
  <div
    style={{
      minHeight: '100vh',
      padding: '100px 20px 40px',
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/images/hero_4.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <div
      style={{
        maxWidth: '820px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(14px)',
        borderRadius: '28px',
        padding: '36px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <div className="mb-4 text-center">
        <h2
          style={{
            color: 'white',
            fontWeight: '700',
            marginBottom: '10px'
          }}
        >
          Edit Listing
        </h2>

        <p
          style={{
            color: 'rgba(255,255,255,0.85)',
            margin: 0
          }}
        >
          Update your property details and keep it guest-ready
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-white fw-semibold">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              borderRadius: '14px',
              padding: '12px'
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-white fw-semibold">
            Description
          </label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            style={{
              borderRadius: '14px',
              padding: '12px'
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',
            gap: '16px'
          }}
        >
          <div className="mb-3">
            <label className="form-label text-white fw-semibold">
              Price per Night
            </label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
              style={{
                borderRadius: '14px',
                padding: '12px'
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white fw-semibold">
              Total Rooms
            </label>
            <input
              type="number"
              name="totalRooms"
              className="form-control"
              min="1"
              value={formData.totalRooms}
              onChange={handleChange}
              required
              style={{
                borderRadius: '14px',
                padding: '12px'
              }}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label text-white fw-semibold">
            Location
          </label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
            required
            style={{
              borderRadius: '14px',
              padding: '12px'
            }}
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-white fw-semibold">
            Amenities
          </label>

          <div
            className="d-flex flex-wrap gap-2"
            style={{
              marginTop: '10px'
            }}
          >
            {AMENITIES_LIST.map(
              (amenity, index) => {
                const isSelected =
                  formData.amenities
                    .map((a) =>
                      a.toLowerCase()
                    )
                    .includes(
                      amenity.toLowerCase()
                    );

                return (
                  <span
                    key={index}
                    onClick={() => {
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          amenities:
                            formData.amenities.filter(
                              (a) =>
                                a !== amenity
                            )
                        });
                      } else {
                        setFormData({
                          ...formData,
                          amenities: [
                            ...formData.amenities,
                            amenity
                          ]
                        });
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                      padding:
                        '8px 14px',
                      borderRadius:
                        '999px',
                      fontSize: '14px',
                      border:
                        isSelected
                          ? '1px solid #fff'
                          : '1px solid rgba(255,255,255,0.3)',
                      backgroundColor:
                        isSelected
                          ? '#2563eb'
                          : 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      transition:
                        '0.2s ease'
                    }}
                  >
                    {amenity}
                  </span>
                );
              }
            )}
          </div>
        </div>

        <button
          className="btn w-100"
          type="submit"
          style={{
            background: 'white',
            color: 'black',
            fontWeight: '600',
            padding: '12px',
            borderRadius: '999px',
            marginTop: '12px'
          }}
        >
          Update Listing
        </button>
      </form>
    </div>
  </div>
);
};

export default EditListing;