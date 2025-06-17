// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', roles: [] });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setForm(prev => {
      const hasRole = prev.roles.includes(role);
      return {
        ...prev,
        roles: hasRole ? prev.roles.filter(r => r !== role) : [...prev.roles, role],
      };
    });
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
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-3">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="email" className="form-control mb-3" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" className="form-control mb-3" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />

        <label className="mb-1">Roles:</label>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="guest" onChange={() => handleRoleChange('guest')} />
          <label className="form-check-label" htmlFor="guest">Guest</label>
        </div>
        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" id="host" onChange={() => handleRoleChange('host')} />
          <label className="form-check-label" htmlFor="host">Host</label>
        </div>

        <button className="btn btn-success w-100" type="submit">Register</button>
      </form>
      <p className="mt-3 text-center">
  Already a user? <Link to="/login">Login</Link>
</p>

    </div>
  );
};

export default Register;