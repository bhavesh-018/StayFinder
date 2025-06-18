import { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // auto-close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
    <style>
        {
            `
.custom-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f56565;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  z-index: 9999;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  font-weight: 500;
  animation: fadein 0.3s ease-in-out;
}

@keyframes fadein {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

            `
        }
    </style>
    <div className="custom-toast">
      {message}
    </div>
    </>
  );
};

export default Toast;
