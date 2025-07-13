const express = require('express');
const router = express.Router();

// Import controllers
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole
} = require('../controllers/user.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Routes - only admin can access these routes
router
  .route('/')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), upload.single('avatar'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router
  .route('/:id/role')
  .put(protect, authorize('admin'), updateUserRole);

module.exports = router;
