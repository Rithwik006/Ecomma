const express = require('express');
const { addOrderItems, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getAllOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
