const express = require('express');
const {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    getAdminBlogs,
} = require('../controllers/blogController');
const {
    toggleLike,
    addComment,
    getInteractions,
    deleteComment,
} = require('../controllers/interactionController');
const { protect, admin, optionalProtect } = require('../middleware/auth');
const router = express.Router();

router.get('/', getBlogs);
router.get('/admin', protect, admin, getAdminBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, admin, createBlog);
router.put('/:id', protect, admin, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

// Interaction Routes
router.get('/:id/interactions', optionalProtect, getInteractions);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/comment/:id', protect, deleteComment);

module.exports = router;

