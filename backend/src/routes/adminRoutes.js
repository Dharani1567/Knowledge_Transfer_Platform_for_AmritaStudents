const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  updateUserRole, 
  deleteUser, 
  getAllResources, 
  updateResourceStatus 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/resources', getAllResources);
router.put('/resources/:id/status', updateResourceStatus);

module.exports = router;
