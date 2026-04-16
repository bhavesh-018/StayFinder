import { useNavigate } from 'react-router-dom';

const BecomeHost = () => {
  const navigate = useNavigate();

  const handleStartHosting = async () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await fetch(
      'http://localhost:5000/api/auth/become-host',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Unable to activate hosting');
      return;
    }

    const updatedUser = {
      ...user,
      role: data.role
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    navigate('/host-dashboard');

  } catch (error) {
    console.error(error);
    alert('Something went wrong');
  }
};

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/hero_4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          padding: '40px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <h1
          style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '16px'
          }}
        >
          Become a Host
        </h1>

        <p
          style={{
            fontSize: '18px',
            lineHeight: '1.6',
            opacity: 0.9,
            marginBottom: '28px'
          }}
        >
          Turn your property into income. Start listing your space,
          manage bookings, and grow your hosting business with StayFinder.
        </p>

        <div style={{ marginBottom: '30px' }}>
          <p>✔ List unlimited properties</p>
          <p>✔ Manage bookings in real-time</p>
          <p>✔ Track earnings and occupancy</p>
        </div>

        <button
          onClick={handleStartHosting}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '999px',
            border: 'none',
            fontSize: '17px',
            fontWeight: '600',
            cursor: 'pointer',
            background: 'white',
            color: 'black',
            transition: '0.3s ease'
          }}
        >
          Start Hosting
        </button>
      </div>
    </div>
  );
};

export default BecomeHost;