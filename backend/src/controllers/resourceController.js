const { Resource, Comment } = require('../models');

// @desc    Get all resources with search & category filters
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res) => {
  const { category, search } = req.query;
  let query = {};

  if (category && category !== 'all') {
    query.category = category;
  }

  if (req.user.role !== 'admin') {
    query.status = 'approved';
  }

  try {
    let resources = await Resource.find(query).populate('uploadedBy', 'name email role');

    // Text search filter (handles in-memory/mock and DB searches)
    if (search) {
      const searchTerm = search.toLowerCase();
      resources = resources.filter(resItem => 
        resItem.title.toLowerCase().includes(searchTerm) || 
        resItem.courseCode.toLowerCase().includes(searchTerm) ||
        (resItem.description && resItem.description.toLowerCase().includes(searchTerm))
      );
    }

    res.json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get resource by ID (includes comments)
// @route   GET /api/resources/:id
// @access  Private
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('uploadedBy', 'name email role');
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Fetch associated comments
    const comments = await Comment.find({ targetId: req.params.id }).populate('author', 'name email role');

    const resourceObj = typeof resource.toObject === 'function' ? resource.toObject() : resource;

    res.json({
      ...resourceObj,
      comments: comments || []
    });
  } catch (error) {
    console.error('Get resource by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res) => {
  const { 
    title, 
    category, 
    courseCode, 
    subject,
    department,
    semester,
    isAnonymous,
    batchYear,
    tags,
    description, 
    fileUrl 
  } = req.body;

  try {
    if (!title || !category || !courseCode || !fileUrl) {
      return res.status(400).json({ message: 'Please provide title, category, courseCode, and file' });
    }

    const resource = await Resource.create({
      title,
      category,
      courseCode,
      subject: subject || '',
      department: department || '',
      semester: semester || '',
      isAnonymous: isAnonymous === true || isAnonymous === 'true',
      batchYear: Number(batchYear) || req.user.batchYear || new Date().getFullYear(),
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      description: description || '',
      fileUrl,
      uploadedBy: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
      ratings: [],
      bookmarks: [],
      lastVerifiedAt: new Date()
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Rate a resource
// @route   POST /api/resources/:id/rate
// @access  Private
const rateResource = async (req, res) => {
  const { score } = req.body;
  const userId = req.user._id;

  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ message: 'Score must be between 1 and 5' });
  }

  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Initialize ratings array if undefined
    if (!resource.ratings) resource.ratings = [];

    // Check if user already rated
    const ratingIndex = resource.ratings.findIndex(r => r.user.toString() === userId.toString());
    
    if (ratingIndex > -1) {
      // Update existing rating
      resource.ratings[ratingIndex].score = Number(score);
    } else {
      // Add new rating
      resource.ratings.push({ user: userId, score: Number(score) });
    }

    await Resource.findByIdAndUpdate(req.params.id, { ratings: resource.ratings });
    res.json({ message: 'Rating updated successfully', ratings: resource.ratings });
  } catch (error) {
    console.error('Rate resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle bookmark a resource
// @route   POST /api/resources/:id/bookmark
// @access  Private
const bookmarkResource = async (req, res) => {
  const userId = req.user._id;

  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!resource.bookmarks) resource.bookmarks = [];

    const bookmarkedIndex = resource.bookmarks.findIndex(bId => bId.toString() === userId.toString());
    let isBookmarked = false;

    if (bookmarkedIndex > -1) {
      // Remove bookmark
      resource.bookmarks.splice(bookmarkedIndex, 1);
    } else {
      // Add bookmark
      resource.bookmarks.push(userId);
      isBookmarked = true;
    }

    await Resource.findByIdAndUpdate(req.params.id, { bookmarks: resource.bookmarks });
    res.json({ isBookmarked, bookmarks: resource.bookmarks });
  } catch (error) {
    console.error('Bookmark resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check ownership or admin role
    const isCreator = resource.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  rateResource,
  bookmarkResource,
  deleteResource
};
