import React, { useState } from 'react';
import API from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Password reset link sent!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      setMessage('');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="card shadow p-4 border-0">
        <h2 className="mb-3 text-center">Forgot Password</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-warning w-100 text-white fw-bold" type="submit">
            Send Reset Link
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;