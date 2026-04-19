import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      await API.post(`/auth/reset-password/${token}`, {
        password
      });

      setSuccess(
        'Password reset successfully! Redirecting to login...'
      );

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Reset failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/images/hero_4.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '20px'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(14px)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white'
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '8px',
              fontSize: '30px',
              fontWeight: '700',
              color: 'white'
            }}
          >
            Reset Password
          </h2>

          <p
            style={{
              textAlign: 'center',
              marginBottom: '24px',
              opacity: 0.85
            }}
          >
            Create a new secure password
          </p>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleReset}>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="New Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none'
              }}
            />

            <input
              type="password"
              className="form-control mb-4"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none'
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '999px',
                border: 'none',
                fontWeight: '600',
                fontSize: '16px',
                background: 'white',
                color: 'black',
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                opacity: loading ? 0.8 : 1
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid #000',
                      borderTop:
                        '2px solid transparent',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation:
                        'spin 0.8s linear infinite'
                    }}
                  />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;