import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const isHost = user?.role?.includes('host');
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 GLASS EFFECT (ONLY CHANGE YOU WANTED)
  const navbarStyle = scrolled
    ? {
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }
    : {
        background: 'transparent',
      };

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
          color: white;
          border: 1px solid white;
        }

        .login-btn:hover,
        .register-btn:hover {
          color: black;
          background-color: white;
        }

        .profile-dropdown-wrapper {
          position: relative;
          margin-left: auto;
          margin-right: 20px;
          cursor: pointer;
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
          }

          .dropdown-menu-custom {
            top: 42px;
            min-width: 160px;
          }
        }
      `}</style>

      <header
        style={{
          ...navbarStyle,
          padding: !scrolled ? '1.8rem 0' : '0.9rem 0',
          transition: 'all 0.3s ease',
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
        }}
      >
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* LOGO */}
            <div
              className="col-6 col-lg-4"
              style={{ fontWeight: 'bold', fontSize: '22px' }}
            >
              <Link
                to="/"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={logo}
                  alt="Stayzen"
                  style={{
                    height: '57px',
                    width: 'auto',
                    objectFit: 'contain',
                    marginTop: '-4px',
                    marginLeft: '4px',
                  }}
                />

                <span
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '24px',
                    letterSpacing: '0.9px',
                    marginTop: '10px',
                  }}
                >
                  Stayzen
                </span>
              </Link>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-6 col-lg-8 d-flex justify-content-end align-items-center">
              {!user && !isAuthPage && (
                <>
                  <Link to="/login" className="login-btn">
                    Login
                  </Link>
                  <Link to="/register" className="register-btn">
                    Register
                  </Link>
                </>
              )}

              {user && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  {!isHost ? (
                    <Link to="/become-host" className="login-btn">
                      Become a Host
                    </Link>
                  ) : (
                    <Link to="/host-dashboard" className="login-btn">
                      Host Dashboard
                    </Link>
                  )}

                  <ProfileDropdown user={user} iconColor="#fff" />
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