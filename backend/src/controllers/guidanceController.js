const { Guidance } = require('../models');

// @desc    Get all guidance articles
// @route   GET /api/guidance
// @access  Private
const getArticles = async (req, res) => {
  const { category, search } = req.query;
  let query = {};

  if (category) {
    query.category = category;
  }

  try {
    let articles = await Guidance.find(query).populate('author', 'name email role department');

    if (search) {
      const searchTerm = search.toLowerCase();
      articles = articles.filter(art => 
        art.title.toLowerCase().includes(searchTerm) ||
        art.content.toLowerCase().includes(searchTerm)
      );
    }

    res.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single article
// @route   GET /api/guidance/:id
// @access  Private
const getArticleById = async (req, res) => {
  try {
    const article = await Guidance.findById(req.params.id).populate('author', 'name email role department');
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Get article by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new guidance article
// @route   POST /api/guidance
// @access  Private (Seniors, Alumni, Admins only)
const createArticle = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    if (req.user.role === 'student') {
      return res.status(403).json({ message: 'Only seniors, alumni, and admins can publish guidance articles' });
    }

    const article = await Guidance.create({
      title,
      content,
      category: category || 'general_advice',
      author: req.user._id
    });

    const populated = await Guidance.findById(article._id).populate('author', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete article
// @route   DELETE /api/guidance/:id
// @access  Private
const deleteArticle = async (req, res) => {
  try {
    const article = await Guidance.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const isAuthor = article.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }

    await Guidance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle
};
