const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import controllers
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  rateMenuItem
} = require('../controllers/menu.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation
const menuItemValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isIn(['starter', 'main course', 'dessert', 'beverage', 'side', 'special']).withMessage('Invalid category')
];

// Routes
router
  .route('/')
  .get(getMenuItems)
  .post(protect, authorize('admin', 'staff'), upload.single('image'), menuItemValidation, createMenuItem);

router
  .route('/:id')
  .get(getMenuItem)
  .put(protect, authorize('admin', 'staff'), upload.single('image'), updateMenuItem)
  .delete(protect, authorize('admin'), deleteMenuItem);

router.post('/:id/rate', protect, rateMenuItem);

module.exports = router;
