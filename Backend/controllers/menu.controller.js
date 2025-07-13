const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');
const createError = require('http-errors');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res, next) => {
  try {
    const { category, isVegetarian, isAvailable, sort, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by availability
    if (isAvailable) {
      query.isAvailable = isAvailable === 'true';
    }
    
    // Filter by vegetarian
    if (isVegetarian) {
      query.isVegetarian = isVegetarian === 'true';
    }
    
    // Pagination
    const limitNum = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * limitNum;
    
    // Execute query
    let menuItems = MenuItem.find(query)
      .skip(skip)
      .limit(limitNum);
    
    // Sort
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      menuItems = menuItems.sort(sortBy);
    } else {
      menuItems = menuItems.sort('name');
    }
    
    const results = await menuItems.exec();
    const total = await MenuItem.countDocuments(query);
    
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

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return next(createError(404, 'Menu item not found'));
    }
    
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private (Admin, Staff)
exports.createMenuItem = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Add image if uploaded
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    
    const menuItem = await MenuItem.create(req.body);
    
    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Admin, Staff)
exports.updateMenuItem = async (req, res, next) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return next(createError(404, 'Menu item not found'));
    }
    
    // Add image if uploaded
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }
    
    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (Admin only)
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return next(createError(404, 'Menu item not found'));
    }
    
    await menuItem.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate menu item
// @route   POST /api/menu/:id/rate
// @access  Private (Authenticated users)
exports.rateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return next(createError(404, 'Menu item not found'));
    }
    
    const { rating, review } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return next(createError(400, 'Rating must be a number between 1 and 5'));
    }
    
    // Check if user has already rated this item
    const existingRatingIndex = menuItem.ratings.findIndex(
      r => r.user.toString() === req.user.id.toString()
    );
    
    if (existingRatingIndex !== -1) {
      // Update existing rating
      menuItem.ratings[existingRatingIndex].value = rating;
      menuItem.ratings[existingRatingIndex].review = review || '';
      menuItem.ratings[existingRatingIndex].date = Date.now();
    } else {
      // Add new rating
      menuItem.ratings.push({
        user: req.user.id,
        value: rating,
        review: review || '',
        date: Date.now()
      });
    }
    
    // Calculate average rating
    menuItem.calculateAverageRating();
    await menuItem.save();
    
    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};
