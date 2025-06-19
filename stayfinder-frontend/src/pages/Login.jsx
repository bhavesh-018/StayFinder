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
      }}
    >
    <div className="container" style={{ maxWidth: '400px' }}>
      <div className="card shadow p-4 border-0">
      <h2 className="mb-3 text-center">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>

      <p className="mt-3 text-center">
        Don’t have an account? <Link to="/register">Create one</Link>
      </p>
      <p className="mt-2 text-center">
  <Link to="/forgot-password" className="text-decoration-none">
    Forgot Password?
  </Link>
</p>
</div>
    </div>
    </div>
  );
};

export default Login;
