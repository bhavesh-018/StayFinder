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
    totalRooms: 1
  });

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
          totalRooms: res.data.totalRooms || 1
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

  <button className="btn btn-primary w-100">
    Update Listing
  </button>

</form>

    </div>
  );
};

export default EditListing;