import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isTransparentNavbar = location.pathname === '/' || location.pathname === '/host-dashboard' || location.pathname === '/become-host' || location.pathname.startsWith('/listings/');
  const user = JSON.parse(localStorage.getItem('user'));
  const isHost = user?.role?.includes('host');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';


  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  if (isTransparentNavbar) {
    window.addEventListener('scroll', handleScroll);
  }

  return () => window.removeEventListener('scroll', handleScroll);
}, [isTransparentNavbar]);
// Determine navbar color based on page & scroll
  const backgroundColor = scrolled ?   '#fff' : 'transparent';
  const textColor = scrolled ? 'black' : 'white';
  return (
    <>
      <style>{`
        .login-btn,
.register-btn {
  padding: 6px 14px;
  border-radius: 999px;
  margin-right: 15px;
  transition: all 0.3s ease;
  font-weight: 500;
  background: transparent;
  text-decoration: none;
  display: inline-block;
}

.white-theme {
  color: white !important;
  border: 1px solid white !important;
}

.white-theme:hover {
  color: black !important;
  background-color: white !important;
}

.black-theme {
  color: black !important;
  border: 1px solid black !important;
}

.black-theme:hover {
  color: white !important;
  background-color: black !important;
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
  top: 48px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 8px 0;
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
  @media (max-width: 768px) {
  .login-btn,
  .register-btn {
    font-size: 13px;
    padding: 6px 10px;
    margin-right: 8px;
    white-space: nowrap;
  }

  .host-btn-mobile {
    font-size: 12px !important;
    padding: 6px 10px !important;
    white-space: nowrap;
    min-width: auto !important;
  }

  .navbar-action-wrapper {
    gap: 8px !important;
  }
    @media (max-width: 768px) {
  .dropdown-menu-custom {
    top: 42px;
    right: 0;
    min-width: 160px;
    font-size: 14px;
  }

  .profile-dropdown-wrapper {
    margin-right: 0 !important;
  }
}
}

      `}</style>

      <header className="site-header js-site-header" style={{  backgroundColor,
        padding: isTransparentNavbar && !scrolled ? '1.8rem 0' : '0.9rem 0',
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
                  <Link to="/login" className={`login-btn ${textColor === 'black' ? 'black-theme' : 'white-theme'}`}>
  Login
</Link>
                  <Link to="/register" className={`register-btn ${textColor === 'black' ? 'black-theme' : 'white-theme'}`}>Register</Link>
                </>
              )}
              {user && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  {!isHost ? (
                    <Link
                        to="/become-host"
                        className={`login-btn ${
                          textColor === 'black' ? 'black-theme' : 'white-theme'
                        }`}
                      >
                        Become a Host
                    </Link>
                  ) : (
                    <Link
                      to="/host-dashboard"
                      className={`login-btn ${textColor === 'black' ? 'black-theme' : 'white-theme'}`}
                    >
                      Host Dashboard
                    </Link>
                  )}

                  <ProfileDropdown user={user} iconColor={textColor} />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
