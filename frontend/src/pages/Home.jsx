import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-4">Loading products...</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="mb-4 text-center">Latest Arrival</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="card">
            <Link to={`/product/${product.id}`}>
              <div className="product-img-wrapper">
                <img src={product.imageUrl} alt={product.name} className="product-img" />
              </div>
            </Link>
            <Link to={`/product/${product.id}`}>
              <h3 className="mt-4">{product.name}</h3>
            </Link>
            <p className="text-secondary">${product.price}</p>
            <Link to={`/product/${product.id}`} className="btn btn-primary w-full mt-4">
              View Details
            </Link>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center mt-4 text-secondary">
          No products found. Login as admin to add products.
        </div>
      )}
    </div>
  );
};

export default Home;
