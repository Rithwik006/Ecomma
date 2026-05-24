import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }

    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/products', {
        name, price, description, stock, imageUrl
      }, config);
      
      // Reset form
      setName(''); setPrice(''); setDescription(''); setStock(''); setImageUrl('');
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Error creating product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        fetchProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Create Product Form */}
        <div className="card">
          <h3>Create Product</h3>
          <form onSubmit={handleCreateProduct} className="mt-4">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Price</label>
              <input type="number" step="0.01" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL (Optional)</label>
              <input type="text" className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary w-full">Create</button>
          </form>
        </div>

        {/* Product List */}
        <div className="md:col-span-2">
          <div className="card">
            <h3>Manage Products</h3>
            <div className="mt-4" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="p-2">{p.id}</td>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">${p.price}</td>
                      <td className="p-2">{p.stock}</td>
                      <td className="p-2">
                        <button onClick={() => handleDelete(p.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
