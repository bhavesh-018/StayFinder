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
          Create New Listing
        </h2>

        <p
          style={{
            color: 'rgba(255,255,255,0.85)',
            margin: 0
          }}
        >
          Turn your space into an opportunity
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-white">
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
          <label className="form-label text-white">
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
            <label className="form-label text-white">
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
            <label className="form-label text-white">
              Total Rooms
            </label>
            <input
              type="number"
              name="totalRooms"
              className="form-control"
              value={formData.totalRooms}
              onChange={handleChange}
              min="1"
              required
              style={{
                borderRadius: '14px',
                padding: '12px'
              }}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label text-white">
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
          <label className="form-label text-white">
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
                  formData.amenities.includes(
                    amenity
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

        <div className="mb-3">
          <label className="form-label text-white">
            Upload Images
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            className="form-control"
            onChange={
              handleImageUpload
            }
            style={{
              borderRadius: '14px',
              padding: '10px'
            }}
          />
        </div>

        {uploading && (
          <p className="text-white">
            Uploading images...
          </p>
        )}

        {images.length > 0 && (
          <div className="mb-3 d-flex flex-wrap gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Uploaded"
                style={{
                  width: '90px',
                  height: '90px',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            ))}
          </div>
        )}

        <button
          className="btn w-100"
          type="submit"
          disabled={uploading}
          style={{
            background: 'white',
            color: 'black',
            fontWeight: '600',
            padding: '12px',
            borderRadius: '999px',
            marginTop: '12px'
          }}
        >
          Create Listing
        </button>
      </form>
    </div>
  </div>
);
};

export default CreateListing;