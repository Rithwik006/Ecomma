import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="navbar-brand">AuraCart</Link>
        <div className="nav-links">
          <Link to="/cart" className="nav-link flex items-center gap-2">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span style={{
                background: 'var(--primary-color)',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '0.8rem'
              }}>
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-secondary flex items-center gap-2">
                <User size={20} /> {user.name}
              </span>
              {user.role === 'Admin' && (
                <Link to="/admin" className="nav-link">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="nav-link flex items-center gap-2">
                <LogOut size={20} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link flex items-center gap-2">
              <User size={20} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
