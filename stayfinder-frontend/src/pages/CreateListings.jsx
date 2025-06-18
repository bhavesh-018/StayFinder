import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import axios from 'axios';

const CreateListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Upload each selected image to Cloudinary
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const data = new FormData();
      data.append('file', file);
      console.log('Selected file: ', file);
      data.append('upload_preset', 'ml_default'); // change this
      data.append('cloud_name', 'dyyhyjxkz'); // change this

      try {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/dyyhyjxkz/image/upload`, data);
        console.log('Image URL:', res.data.secure_url);
        uploadedUrls.push(res.data.secure_url);
      } catch (err) {
        console.error('Upload failed:', err);
        setError('Image upload failed');
        setUploading(false);
        return;
      }
    }

    setImages(uploadedUrls);
    setUploading(false);
  };

  // Submit listing with images
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await API.post(
        '/listings',
        { ...formData, images },
        { headers: { Authorization: `Bearer ${token}`,  'Content-Type': 'application/json', } }
      );
      setSuccess('Listing created successfully!');
      setTimeout(() => navigate('/my-listings'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '90px' }}>
      
       <h2 className="mb-3 text-center">Create New Listing</h2>

  <div className="mb-4 text-center">
    <h4 className="fw-bold">“Turn your space into an opportunity.”</h4>
    <p className="text-muted">Share your home with the world and start earning with StayFinder.</p>
  </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          className="form-control mb-3"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          className="form-control mb-3"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
        <input
          type="number"
          name="price"
          className="form-control mb-3"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          className="form-control mb-3"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          multiple
          className="form-control mb-3"
          onChange={handleImageUpload}
        />
        {uploading && <p>Uploading images...</p>}
        {images.length > 0 && (
          <div className="mb-3">
            {images.map((img, i) => (
              <img key={i} src={img} alt="Uploaded" width={80} className="me-2 mb-2" />
            ))}
          </div>
        )}
        <button className="btn btn-primary w-100" type="submit" disabled={uploading}>
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListing;