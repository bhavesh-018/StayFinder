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
    <div className="container" style={{ maxWidth: '600px', marginTop: '100px' }}>
      <h2 className="text-center mb-4 text-white">Edit Listing</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>

  <div className="mb-3">
    <label className="form-label fw-semibold text-white">Title</label>
    <input
      type="text"
      name="title"
      className="form-control"
      value={formData.title}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-3">
    <label className="form-label fw-semibold text-white">Description</label>
    <textarea
      name="description"
      className="form-control"
      value={formData.description}
      onChange={handleChange}
      rows={4}
      required
    />
  </div>

  <div className="mb-3">
    <label className="form-label fw-semibold text-white">Price per Night</label>
    <input
      type="number"
      name="price"
      className="form-control"
      value={formData.price}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-3">
    <label className="form-label fw-semibold text-white">Location</label>
    <input
      type="text"
      name="location"
      className="form-control"
      value={formData.location}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-4">
    <label className="form-label fw-semibold text-white">Total Rooms Available</label>
    <input
      type="number"
      name="totalRooms"
      className="form-control"
      min="1"
      value={formData.totalRooms}
      onChange={handleChange}
      required
    />
    <small className="text-muted">
      Set 1 for a single property. Increase for hotel-style listings.
    </small>
  </div>

  <div className="mb-4">
  <label className="form-label fw-semibold text-white">Amenities</label>

  <div className="d-flex flex-wrap gap-2">

      {AMENITIES_LIST.map((amenity, index) => {
        const isSelected = formData.amenities.map(a => a.toLowerCase()).includes(amenity.toLowerCase());

        return (
          <span
            key={index}
            onClick={() => {
              if (isSelected) {
                setFormData({
                  ...formData,
                  amenities: formData.amenities.filter(a => a !== amenity)
                });
              } else {
                setFormData({
                  ...formData,
                  amenities: [...formData.amenities, amenity]
                });
              }
            }}
            style={{
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              border: isSelected ? '1px solid #0d6efd' : '1px solid #555',
              backgroundColor: isSelected ? '#0d6efd' : 'transparent',
              color: isSelected ? '#fff' : '#ccc',
              transition: '0.2s'
            }}
          >
            {amenity}
          </span>
        );
      })}

    </div>
  </div>

  <button className="btn btn-primary w-100">
    Update Listing
  </button>

</form>

    </div>
  );
};

export default EditListing;