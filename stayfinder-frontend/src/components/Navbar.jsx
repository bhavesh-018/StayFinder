import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/';
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  if (isHome) {
    window.addEventListener('scroll', handleScroll);
  }

  return () => window.removeEventListener('scroll', handleScroll);
}, [isHome]);
// Determine navbar color based on page & scroll
 const backgroundColor = isHome ? (scrolled ?   '#fff' : 'transparent') : '#fff';
  const textColor = isHome ? (scrolled ? 'black' : 'white') : 'black';
  return (
    <>
      <style>{`
        .login-btn, .register-btn {
          border: 1px solid #fff;
          color: #fff;
          padding: 6px 14px;
          border-radius: 999px;
          margin-right: 15px;
          transition: 0.3s ease;
          font-weight: 500;
        }
        .login-btn:hover, .register-btn:hover {
          background: white;
          color: #000;
        }
        @media (max-width: 768px) {
          .login-btn, .register-btn {
            font-size: 14px;
            padding: 5px 10px;
          }
        }
          .profile-dropdown-wrapper {
  position: relative;
  margin-left: auto;
  margin-right: 20px;
  cursor: pointer;
}

.profile-icon {
  color: white;
  font-size: 26px;
}

.dropdown-menu-custom {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu-custom a,
.dropdown-menu-custom button {
  padding: 10px 15px;
  text-align: left;
  border: none;
  background: none;
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.dropdown-menu-custom a:hover,
.dropdown-menu-custom button:hover {
  background-color: #f2f2f2;
}

      `}</style>

      <header className="site-header js-site-header" style={{  backgroundColor,
        padding: isHome && !scrolled ? '3.5rem 0' : '1.5rem 0',
        transition: 'all 0.3s ease',
        position: 'fixed',
        width: '100%',
        zIndex: 1000,}}>
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-6 col-lg-4 site-logo" data-aos="fade" style={{ fontWeight: 'bold', fontSize: '22px' }}>
              <Link to="/" style={{ color: textColor, textDecoration: 'none' }}>StayFinder</Link>
            </div>

            <div className="col-6 col-lg-8 d-flex justify-content-end align-items-center">
              {!user && !isAuthPage && (
                <>
                  <Link to="/login" className="login-btn" style={{ color: textColor, borderColor: textColor }}>Login</Link>
                  <Link to="/register" className="register-btn" style={{ color: textColor, borderColor: textColor }}>Register</Link>
                </>
              )}
              {user && <ProfileDropdown user={user} iconColor={textColor} />}

            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
