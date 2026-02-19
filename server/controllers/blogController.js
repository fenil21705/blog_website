const { Blog, User, Category } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            where: { status: 'published' },
            include: [
                { model: User, as: 'author', attributes: ['username'] },
                { model: Category, as: 'categoryData', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']],
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: { slug: req.params.slug },
            include: [
                { model: User, as: 'author', attributes: ['username'] },
                { model: Category, as: 'categoryData', attributes: ['name'] }
            ],
        });

        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBlog = async (req, res) => {
    const { title, content, excerpt, featuredImage, category, status } = req.body;
    const slug = title.toLowerCase().split(' ').join('-') + '-' + Date.now();

    try {
        const blog = await Blog.create({
            title,
            slug,
            content,
            excerpt,
            featuredImage,
            category,
            status,
            authorId: req.user.id,
        });
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (blog) {
            await blog.update(req.body);
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (blog) {
            await blog.destroy();
            res.json({ message: 'Blog removed' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            include: [{ model: User, as: 'author', attributes: ['username'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
