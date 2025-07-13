const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controllers
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getMyOrders
} = require('../controllers/order.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Validation
const orderValidation = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.menuItem').notEmpty().withMessage('Menu item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('orderType').isIn(['dine-in', 'takeaway', 'delivery']).withMessage('Invalid order type')
];

// Routes
router
  .route('/')
  .get(protect, authorize('admin', 'staff'), getOrders)
  .post(protect, orderValidation, createOrder);

router
  .route('/myorders')
  .get(protect, getMyOrders);

router
  .route('/:id')
  .get(protect, getOrder)
  .put(protect, updateOrder)
  .delete(protect, authorize('admin'), deleteOrder);

router
  .route('/:id/status')
  .put(protect, authorize('admin', 'staff'), updateOrderStatus);

module.exports = router;
