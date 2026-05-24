import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  if (loading) return <div className="text-center mt-4">Loading product...</div>;
  if (!product) return <div className="text-center mt-4">Product not found</div>;

  return (
    <div className="animate-fade-in card max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="product-img-wrapper">
          <img src={product.imageUrl} alt={product.name} className="product-img" />
        </div>
        <div>
          <h1>{product.name}</h1>
          <h2 className="text-primary">${product.price}</h2>
          <p className="mt-4 text-secondary">{product.description}</p>
          <div className="mt-4">
            <p className={product.stock > 0 ? 'text-success' : 'text-error'}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </p>
          </div>
          <button 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
            className={`btn w-full mt-4 ${product.stock > 0 ? 'btn-primary' : 'btn-secondary'}`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
