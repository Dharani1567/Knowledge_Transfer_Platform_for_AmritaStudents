const { User, Resource } = require('../models');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const safeUsers = users.map(user => {
      const u = typeof user.toObject === 'function' ? user.toObject() : user;
      delete u.password;
      return u;
    });
    res.json(safeUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['student', 'senior', 'alumni', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const u = typeof updatedUser.toObject === 'function' ? updatedUser.toObject() : updatedUser;
    delete u.password;
    res.json(u);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all resources (including pending and rejected)
// @route   GET /api/admin/resources
// @access  Private/Admin
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('uploadedBy', 'name email role');
    res.json(resources);
  } catch (error) {
    console.error('Get all resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update resource status (approve/reject)
// @route   PUT /api/admin/resources/:id/status
// @access  Private/Admin
const updateResourceStatus = async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('uploadedBy', 'name email role');
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    console.error('Update resource status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
  getAllResources,
  updateResourceStatus
};
