const express = require('express');
const router = express.Router();
const { 
  getResources, 
  getResourceById, 
  createResource, 
  rateResource, 
  bookmarkResource, 
  deleteResource 
} = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all resource endpoints

router.route('/')
  .get(getResources)
  .post(createResource);

router.route('/:id')
  .get(getResourceById)
  .delete(deleteResource);

router.post('/:id/rate', rateResource);
router.post('/:id/bookmark', bookmarkResource);

module.exports = router;
