const express = require('express');
const router = express.Router();
const { 
  getExperiences, 
  getExperienceById, 
  createExperience, 
  deleteExperience 
} = require('../controllers/experienceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getExperiences)
  .post(createExperience);

router.route('/:id')
  .get(getExperienceById)
  .delete(deleteExperience);

module.exports = router;
