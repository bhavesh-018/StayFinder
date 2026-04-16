import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/', { state: { loginSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
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
          fontSize: '32px',
          fontWeight: '700',
          color: 'white'
        }}
      >
        Welcome back
      </h2>

      <p
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          opacity: 0.85
        }}
      >
        Sign in to continue to StayFinder
      </p>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '12px',
            border: 'none'
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '999px',
            border: 'none',
            fontWeight: '600',
            fontSize: '16px',
            background: 'white',
            color: 'black',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>

      <p
        style={{
          marginTop: '18px',
          textAlign: 'center'
        }}
      >
        <Link
          to="/forgot-password"
          style={{
            color: 'white',
            textDecoration: 'underline'
          }}
        >
          Forgot Password?
        </Link>
      </p>

      <p
        style={{
          marginTop: '14px',
          textAlign: 'center',
          color: 'white'
        }}
      >
        Don’t have an account?{' '}
        <Link
          to="/register"
          style={{
            color: 'white',
            fontWeight: '600',
            textDecoration: 'underline'
          }}
        >
          Create one
        </Link>
      </p>
    </div>
  </div>
);
};

export default Login;
