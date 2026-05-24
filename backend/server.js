require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Database connection & sync
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
