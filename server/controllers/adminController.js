const { Blog, User, Comment, Like } = require('../models');

exports.getStats = async (req, res) => {
    try {
        const [totalPosts, totalUsers, totalComments, totalLikes] = await Promise.all([
            Blog.count(),
            User.count(),
            Comment.count(),
            Like.count()
        ]);

        // Get latest posts
        const recentPosts = await Blog.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'author', attributes: ['username'] }]
        });

        res.json({
            stats: {
                totalPosts,
                totalUsers,
                totalComments,
                totalLikes
            },
            recentPosts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
