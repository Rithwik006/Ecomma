const Order = require('../models/Order');

const addOrderItems = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    
    if (products && products.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const order = await Order.create({
      userId: req.user.id,
      products,
      totalAmount
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      order.orderStatus = req.body.status || order.orderStatus;
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getAllOrders, updateOrderStatus };
