const { Experience, Comment } = require('../models');

// @desc    Get all placement & internship experiences
// @route   GET /api/experiences
// @access  Private
const getExperiences = async (req, res) => {
  const { type, company, search } = req.query;
  let query = {};

  if (type) {
    query.type = type;
  }
  if (company) {
    query.company = company;
  }

  try {
    let experiences = await Experience.find(query).populate('author', 'name email role department batchYear');

    if (search) {
      const searchTerm = search.toLowerCase();
      experiences = experiences.filter(exp => 
        exp.company.toLowerCase().includes(searchTerm) ||
        exp.role.toLowerCase().includes(searchTerm) ||
        (exp.preparationTips && exp.preparationTips.toLowerCase().includes(searchTerm))
      );
    }

    res.json(experiences);
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get experience by ID
// @route   GET /api/experiences/:id
// @access  Private
const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).populate('author', 'name email role department batchYear');
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const comments = await Comment.find({ targetId: req.params.id }).populate('author', 'name email role');

    const experienceObj = typeof experience.toObject === 'function' ? experience.toObject() : experience;

    res.json({
      ...experienceObj,
      comments: comments || []
    });
  } catch (error) {
    console.error('Get experience by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new placement or internship experience
// @route   POST /api/experiences
// @access  Private (Seniors, Alumni, Admins only)
const createExperience = async (req, res) => {
  const { type, company, role, packageOrStipend, rounds, preparationTips, difficulty } = req.body;

  try {
    if (!type || !company || !role || !rounds || rounds.length === 0) {
      return res.status(400).json({ message: 'Please provide type, company, role, and at least one round' });
    }

    // Gating check: juniors/normal students can't add reviews yet (unless overridden by college)
    if (req.user.role === 'student') {
      return res.status(403).json({ message: 'Only seniors, alumni, and admins can post interview experiences' });
    }

    const experience = await Experience.create({
      author: req.user._id,
      type,
      company,
      role,
      packageOrStipend: packageOrStipend || '',
      rounds,
      preparationTips: preparationTips || '',
      difficulty: difficulty || 'medium'
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    const isAuthor = experience.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this experience' });
    }

    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getExperiences,
  getExperienceById,
  createExperience,
  deleteExperience
};
