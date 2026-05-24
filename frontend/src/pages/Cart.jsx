import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-4">
        <h2>Your Cart is Empty</h2>
        <Link to="/" className="btn btn-primary mt-4">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <h2 className="mb-4">Shopping Cart</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="card flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
              <div>
                <Link to={`/product/${item.id}`}><h4>{item.name}</h4></Link>
                <p className="text-secondary">${item.price}</p>
                <p>Qty: {item.qty}</p>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="btn btn-danger">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      <div>
        <div className="card">
          <h3>Order Summary</h3>
          <p className="mt-4 flex justify-between">
            <span>Items:</span>
            <span>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
          </p>
          <p className="mt-2 flex justify-between font-bold text-primary">
            <span>Total:</span>
            <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
          </p>
          <button onClick={handleCheckout} className="btn btn-primary w-full mt-4">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
