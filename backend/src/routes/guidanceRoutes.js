const express = require('express');
const router = express.Router();
const { getArticles, getArticleById, createArticle, deleteArticle } = require('../controllers/guidanceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getArticles)
  .post(createArticle);

router.route('/:id')
  .get(getArticleById)
  .delete(deleteArticle);

module.exports = router;
