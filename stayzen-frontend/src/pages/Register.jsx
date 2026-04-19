import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          marginBottom: '24px',
          fontSize: '32px',
          fontWeight: '700',
          color: 'white'
        }}
      >
        Create your account
      </h2>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            padding: '12px',
            borderRadius: '12px',
            border: 'none'
          }}
        />

        <input
          type="email"
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
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
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
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
          Register
        </button>
      </form>

      <p
        style={{
          marginTop: '20px',
          textAlign: 'center',
          color: 'white'
        }}
      >
        Already a user?{' '}
        <Link
          to="/login"
          style={{
            color: 'white',
            fontWeight: '600',
            textDecoration: 'underline'
          }}
        >
          Login
        </Link>
      </p>
    </div>
  </div>
);
};

export default Register;