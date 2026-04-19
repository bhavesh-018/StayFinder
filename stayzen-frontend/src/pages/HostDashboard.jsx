import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HostDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  return (
  <div
    style={{
      minHeight: '100vh',
      width: '100%',
      padding: '100px 40px 40px',
      display: 'flex',
      justifyContent: 'center'
    }}
  >
    <div
      style={{
        width: '100%',
        maxWidth: '1280px',
        minHeight: 'calc(100vh - 120px)',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
        borderRadius: '28px',
        padding: '40px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #111827, #374151)',
              color: 'white',
              borderRadius: '24px',
              padding: '40px',
              marginBottom: '40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}
          >
            <h1
              style={{
                fontSize: '42px',
                fontWeight: '700',
                marginBottom: '10px',
                color: 'white'
              }}
            >
              Welcome back, {user?.name}
            </h1>

            <p
              style={{
                fontSize: '18px',
                opacity: 0.85,
                color: 'white'
              }}
            >
              Manage your listings, bookings, and earnings from one place.
            </p>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}
          >
            <StatCard title="Total Listings" value="4" />
            <StatCard title="Active Bookings" value="12" />
            <StatCard title="Occupancy" value="78%" />
            <StatCard title="Revenue" value="₹48,000" />
          </div>

          {/* Actions */}
          <h2
            style={{
              fontSize: '28px',
              marginBottom: '20px',
              fontWeight: '700',
              color: '#111827'
            }}
          >
            Quick Actions
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            <DashboardCard
              title="Add Listing"
              subtitle="Create and publish a new stay"
              onClick={() => navigate('/listings/create')}
            />

            <DashboardCard
              title="My Listings"
              subtitle="Manage your existing properties"
              onClick={() => navigate('/my-listings')}
            />

            <DashboardCard
              title="Bookings"
              subtitle="Check reservations and requests"
              onClick={() => navigate('/host-bookings')}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '18px',
        padding: '24px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
      }}
    >
      <p
        style={{
          color: '#6b7280',
          marginBottom: '8px',
          fontSize: '15px'
        }}
      >
        {title}
      </p>

      <h3
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#111827'
        }}
      >
        {value}
      </h3>
    </div>
  );
};

const DashboardCard = ({ title, subtitle, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        border: '1px solid #e5e7eb',
        textAlign: 'left',
        width: '100%',
        minHeight: '130px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow =
          '0 14px 30px rgba(0,0,0,0.1)';
        e.currentTarget.style.border =
          '1px solid #cbd5e1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 8px 24px rgba(0,0,0,0.06)';
        e.currentTarget.style.border =
          '1px solid #e5e7eb';
      }}
    >
      <div>
        <h3
          style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '10px',
            color: '#111827'
          }}
        >
          {title}
        </h3>

        <p style={{ color: '#6b7280', margin: 0 }}>
          {subtitle}
        </p>
      </div>

      <span
        style={{
          marginTop: '16px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#2563eb'
        }}
      >
        Open →
      </span>
    </button>
  );
};

export default HostDashboard;