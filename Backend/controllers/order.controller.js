const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');
const createError = require('http-errors');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin, Staff)
exports.getOrders = async (req, res, next) => {
  try {
    const { status, orderType, paymentStatus, sort, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by orderType
    if (orderType) {
      query.orderType = orderType;
    }
    
    // Filter by paymentStatus
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    // Pagination
    const limitNum = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * limitNum;
    
    // Execute query
    let orders = Order.find(query)
      .populate('user', 'name email')
      .skip(skip)
      .limit(limitNum);
    
    // Sort
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      orders = orders.sort(sortBy);
    } else {
      orders = orders.sort('-createdAt');
    }
    
    const results = await orders.exec();
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: results.length,
      pagination: {
        page: parseInt(page, 10),
        limit: limitNum,
        total
      },
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (User, Admin, Staff)
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return next(createError(404, 'Order not found'));
    }
    
    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && order.user.toString() !== req.user.id.toString()) {
      return next(createError(403, 'Not authorized to access this order'));
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private (All authenticated users)
exports.createOrder = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { items, orderType, tableNumber, specialInstructions, deliveryAddress } = req.body;
    
    // Verify all menu items exist
    const menuItemIds = items.map(item => item.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });
    
    if (menuItems.length !== menuItemIds.length) {
      return next(createError(400, 'One or more menu items not found'));
    }
    
    // Create order object with enhanced item details
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of items) {
      const menuItem = menuItems.find(mi => mi._id.toString() === item.menuItem.toString());
      
      if (!menuItem.isAvailable) {
        return next(createError(400, `${menuItem.name} is currently not available`));
      }
      
      const orderItem = {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || ''
      };
      
      orderItems.push(orderItem);
      totalAmount += menuItem.price * item.quantity;
    }
    
    // Create new order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      specialInstructions,
      orderHistory: [{ status: 'pending', note: 'Order created' }]
    });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (User who created the order, Admin, Staff)
exports.updateOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(createError(404, 'Order not found'));
    }
    
    // Check if user is authorized to update this order
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && order.user.toString() !== req.user.id.toString()) {
      return next(createError(403, 'Not authorized to update this order'));
    }
    
    // Can only update certain fields based on order status
    if (order.status !== 'pending') {
      return next(createError(400, 'Order can only be updated when in pending status'));
    }
    
    // Update the order
    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(createError(404, 'Order not found'));
    }
    
    await order.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin, Staff)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status || !['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'].includes(status)) {
      return next(createError(400, 'Invalid status'));
    }
    
    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return next(createError(404, 'Order not found'));
    }
    
    // Update status
    order.status = status;
    
    // If order is completed or delivered, update delivery time
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    
    await order.save();
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders for logged in user
// @route   GET /api/orders/myorders
// @access  Private (All authenticated users)
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
