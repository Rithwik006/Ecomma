import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleGoogleLogin = async () => {
    const res = await googleLogin();
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="animate-fade-in card" style={{ maxWidth: '400px', margin: '0 auto', marginTop: '2rem' }}>
      <h2 className="text-center">Login</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Sign In</button>
      </form>
      
      <div className="mt-4 mb-4 text-center text-secondary" style={{ display: 'flex', alignItems: 'center' }}>
        <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
        <span style={{ padding: '0 10px' }}>OR</span>
        <hr style={{ flex: 1, borderColor: 'var(--border-color)' }} />
      </div>

      <button 
        onClick={handleGoogleLogin} 
        className="btn btn-secondary w-full flex items-center justify-center gap-2"
        style={{ backgroundColor: 'white', color: '#333', border: '1px solid #ccc' }}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
        Sign in with Google
      </button>

      <p className="mt-4 text-center">
        New Customer? <Link to="/register" className="text-primary">Register</Link>
      </p>
    </div>
  );
};

export default Login;
