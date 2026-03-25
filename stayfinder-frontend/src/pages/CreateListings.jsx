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
    totalRooms: 1,
    amenities: [],
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
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
        { ...formData, price: Number(formData.price),
    totalRooms: Number(formData.totalRooms), images },
        { headers: { Authorization: `Bearer ${token}`,  'Content-Type': 'application/json', } }
      );
      navigate('/my-listings', {
  state: { toast: { type: 'success', message: 'Listing created successfully!' } }
});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '90px' }}>
      
       <h2 className="mb-3 text-center text-white">Create New Listing</h2>

  <div className="mb-4 text-center">
    <h4 className="fw-bold text-white">“Turn your space into an opportunity.”</h4>
    <p className="text-muted text-white">Share your home with the world and start earning with StayFinder.</p>
  </div>

      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>

  <div className="mb-3">
    <label className="form-label text-white">Title</label>
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
    <label className="form-label text-white">Description</label>
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
    <label className="form-label text-white">Price per Night</label>
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
    <label className="form-label text-white">Location</label>
    <input
      type="text"
      name="location"
      className="form-control"
      value={formData.location}
      onChange={handleChange}
      required
    />
  </div>

  <div className="mb-3">
    <label className="form-label text-white">Total Rooms</label>
    <input
      type="number"
      name="totalRooms"
      className="form-control"
      value={formData.totalRooms}
      onChange={handleChange}
      min="1"
      required
    />
  </div>

  <div className="mb-3">
  <label className="form-label text-white">Amenities</label>

  <div className="d-flex flex-wrap gap-2">

    {AMENITIES_LIST.map((amenity, index) => {
      const isSelected = formData.amenities.includes(amenity);

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

  <div className="mb-3">
    <label className="form-label text-white">Upload Images</label>
    <input
      type="file"
      accept="image/*"
      multiple
      className="form-control"
      onChange={handleImageUpload}
    />
  </div>

  {uploading && <p className="text-white">Uploading images...</p>}

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