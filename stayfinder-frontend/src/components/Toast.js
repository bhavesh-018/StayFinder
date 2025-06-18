import { useEffect } from 'react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <style>
        {`
          .custom-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 9999;
            font-weight: 500;
            color: white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            animation: fadein 0.3s ease-in-out;
          }

          .custom-toast.success {
            background-color: #38a169; /* green */
          }

          .custom-toast.error {
            background-color: #e53e3e; /* red */
          }

          @keyframes fadein {
            from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            to   { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}
      </style>
      <div className={`custom-toast ${type}`}>
        {message}
      </div>
    </>
  );
};

export default Toast;