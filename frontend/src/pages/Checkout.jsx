import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      await axios.post('http://localhost:5000/api/orders', {
        products: cartItems,
        totalAmount
      }, config);

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
    }
    setLoading(false);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (success) {
    return (
      <div className="text-center mt-4 animate-fade-in">
        <h2 className="text-success">Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in card max-w-4xl mx-auto">
      <h2 className="mb-4">Checkout</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3>Shipping Address</h3>
          <p className="mt-4 text-secondary">
            Since this is a basic demo, we will use your default account address.
            <br/><br/>
            Name: {user.name}<br/>
            Email: {user.email}
          </p>
        </div>
        <div>
          <h3>Order Summary</h3>
          <div className="mt-4">
            {cartItems.map((item) => (
              <p key={item.id} className="flex justify-between">
                <span>{item.qty} x {item.name}</span>
                <span>${(item.qty * item.price).toFixed(2)}</span>
              </p>
            ))}
          </div>
          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
          <p className="flex justify-between font-bold text-primary">
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </p>
          <button 
            onClick={handlePlaceOrder} 
            disabled={loading || cartItems.length === 0}
            className="btn btn-primary w-full mt-4"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
