import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../ProfileDropdown.css';

const ProfileDropdown = ({ user }) => {

  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const roles = user?.role || [];
  console.log(roles);

  const isHome = location.pathname === '/';

  const handleToggle = () => {
    setShowDropdown(prev => !prev);
  };

  const handleClickOutside = e => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
        navigate('/');
      };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown-wrapper" ref={dropdownRef}>
      <button
        className="profile-icon"
        onClick={handleToggle}
        style={{ color: isHome ? 'white' : 'black' }}
      >
        <i className="fa fa-user-circle" />
      </button>

      {showDropdown && (
        <div className="dropdown-menu-custom">
          <Link to="/profile">My Profile</Link>
          {roles.includes('guest') && <Link to="/bookings">Bookings</Link>}
          {roles.includes('host') && <Link to="/listings">Listings</Link>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
