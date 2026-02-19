const { Comment, Like, User, Blog } = require('../models');

// Toggle Like
exports.toggleLike = async (req, res) => {
    const { id: blogId } = req.params;
    const userId = req.user.id;

    try {
        const existingLike = await Like.findOne({ where: { blogId, userId } });

        if (existingLike) {
            await existingLike.destroy();
            return res.json({ liked: false });
        } else {
            await Like.create({ blogId, userId });
            return res.json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Comment
exports.addComment = async (req, res) => {
    const { id: blogId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
        return res.status(400).json({ message: 'Comment content is required' });
    }

    try {
        const comment = await Comment.create({
            content,
            blogId,
            userId
        });

        // Fetch the comment with user info to return to frontend
        const commentWithUser = await Comment.findByPk(comment.id, {
            include: [{ model: User, as: 'user', attributes: ['username'] }]
        });

        res.status(201).json(commentWithUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Interactions (Likes count and Comments)
exports.getInteractions = async (req, res) => {
    const { id: blogId } = req.params;
    const userId = req.user ? req.user.id : null;

    try {
        const likesCount = await Like.count({ where: { blogId } });
        const comments = await Comment.findAll({
            where: { blogId },
            include: [{ model: User, as: 'user', attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });

        let userLiked = false;
        if (userId) {
            const like = await Like.findOne({ where: { blogId, userId } });
            userLiked = !!like;
        }

        res.json({
            likesCount,
            userLiked,
            comments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
    const { id: commentId } = req.params;
    const userId = req.user.id;

    try {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        await comment.destroy();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Activity (Liked blogs and their comments)
exports.getUserActivity = async (req, res) => {
    const userId = req.user.id;

    try {
        const likedBlogs = await Like.findAll({
            where: { userId },
            include: [{
                model: Blog,
                attributes: ['id', 'title', 'slug', 'featuredImage', 'excerpt']
            }],
            order: [['createdAt', 'DESC']]
        });

        const userComments = await Comment.findAll({
            where: { userId },
            include: [{
                model: Blog,
                attributes: ['id', 'title', 'slug']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            likes: likedBlogs.map(l => l.Blog),
            comments: userComments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

