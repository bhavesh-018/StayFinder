import { useEffect, useState } from 'react';
import API from '../api/axios';
import StyledListingCard from '../components/StyledListingCard';
import Toast from '../components/Toast';
import { useLocation } from 'react-router-dom';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const toastData = location.state?.toast;

  const [toast, setToast] = useState(toastData || null);

  useEffect(() => {
    const fetchListings = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(`/listings/user/${user.id}`);
      if (!user?.id) return;

      try {
        const res = await API.get(`/listings/user/${user.id}`);
        console.log(res.data)
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching user listings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <>
     {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    <div className="container" style={{ marginTop: '100px' }}>
      <h2 className="mb-4 text-white text-bold">My Listings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <p>You haven't created any listings yet.</p>
      ) : (
        listings.map((listing, i) => (
          <StyledListingCard key={i} {...listing} />
        ))
      )}
    </div>
    </>
  );
};

export default MyListings;