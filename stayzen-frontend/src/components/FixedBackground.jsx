// components/FixedBackground.jsx
import { useLocation } from 'react-router-dom';

const FixedBackground = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) return null; // Don't render background on homepage

  return (
    <>
      <style>{`
        .fixed-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-image: url(${process.env.PUBLIC_URL}/images/hero_4.jpg);
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          z-index: -1;
        }

        .fixed-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
        }
      `}</style>
      <div className="fixed-bg" />
    </>
  );
};

export default FixedBackground;
