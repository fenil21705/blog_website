const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userCount = await User.count();
        const role = userCount === 0 ? 'admin' : 'user';

        const user = await User.create({
            username,
            email,
            password,
            role
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user && (await user.comparePassword(password))) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            const { username, email } = req.body;

            // Check if email is already taken by another user
            if (email && email !== user.email) {
                const emailExists = await User.findOne({ where: { email } });
                if (emailExists) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
            }

            user.username = username || user.username;
            user.email = email || user.email;

            await user.save();

            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
    });
    res.json(user);
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Hash new password manually since hook is beforeCreate
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {

    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await user.destroy();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.forceCreateAdmin = async (req, res) => {
    try {
        await sequelize.sync();
        await User.destroy({ where: { email: 'admin@test.com' } });

        const user = await User.create({
            username: 'SuperAdmin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin'
        });

        res.json({
            message: 'Admin User Created Successfully',
            email: 'admin@test.com',
            password: 'password123',
            login_url: 'https://fenil21705.github.io/blog-website/admin'
        });
    } catch (error) {
        res.json({ message: 'Error creating admin', error: error.message });
    }
};

exports.seedDatabase = async (req, res) => {
    const { Category, Blog, sequelize } = require('../models');
    try {
        console.log('Syncing database for seed...');
        await sequelize.sync({ alter: true });

        // 1. Create Categories
        const categories = [
            { name: 'Technology', slug: 'technology' },
            { name: 'Design', slug: 'design' },
            { name: 'Lifestyle', slug: 'lifestyle' },
            { name: 'Travel', slug: 'travel' },
            { name: 'Coding', slug: 'coding' }
        ];

        const catMap = {};
        for (const c of categories) {
            const [cat] = await Category.findOrCreate({ where: { name: c.name }, defaults: c });
            catMap[c.name] = cat.id;
        }

        // 2. Find Admin User
        let admin = await User.findOne({ where: { role: 'admin' } });
        if (!admin) {
            admin = await User.create({
                username: 'admin',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin'
            });
        }

        // 3. Create Blogs
        const blogs = [
            {
                title: "The Future of Web Development",
                content: `<p>Web development is evolving rapidly. From <strong>AI-assisted coding</strong> to the rise of <em>Serverless Architecture</em>, the landscape is changing.</p><p>In this post, we explore how newer frameworks like React 19 and Next.js are shaping the future.</p>`,
                excerpt: "Explore the latest trends in web development, from AI tools to serverless architectures.",
                slug: "future-of-web-development",
                category: "Technology", // Required String Field
                categoryId: catMap['Technology'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072",
                status: 'published'
            },
            {
                title: "Minimalism in UI Design",
                content: `<p>Less is more. That's the mantra of <strong>Minimalism</strong>.</p><p>Good design is not about adding more elements, but about removing the unnecessary ones until only the essential remains.</p>`,
                excerpt: "Why less is more in modern user interface design and how to achieve it.",
                slug: "minimalism-in-ui-design",
                category: "Design",
                categoryId: catMap['Design'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=2070",
                status: 'published'
            },
            {
                title: "10 Tips for a Productive Morning",
                content: `<p>How you start your day determines how the rest of it goes.</p><ul><li>Wake up early</li><li>Drink water</li><li>Exercise</li><li>Plan your day</li></ul>`,
                excerpt: "Transform your daily routine with these simple yet effective morning habits.",
                slug: "10-tips-productive-morning",
                category: "Lifestyle",
                categoryId: catMap['Lifestyle'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1499750310159-5b5f096fd51b?auto=format&fit=crop&q=80&w=2070",
                status: 'published'
            },
            {
                title: "Traveling to Japan: A Guide",
                content: `<p>Japan is a country of contrasts. From the neon lights of Tokyo to the quiet temples of Kyoto.</p><p>This guide covers everything you need to know before your trip.</p>`,
                excerpt: "Everything you need to know before visiting the Land of the Rising Sun.",
                slug: "traveling-to-japan-guide",
                category: "Travel",
                categoryId: catMap['Travel'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2070",
                status: 'published'
            },
            {
                title: "Understanding React Hooks",
                content: `<p>Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.</p>`,
                excerpt: "A deep dive into useState, useEffect, and custom hooks.",
                slug: "understanding-react-hooks",
                category: "Coding",
                categoryId: catMap['Coding'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2070",
                status: 'published'
            }
        ];

        let createdCount = 0;
        for (const b of blogs) {
            const existing = await Blog.findOne({ where: { slug: b.slug } });
            if (!existing) {
                await Blog.create(b);
                createdCount++;
            }
        }

        res.json({ message: `Database seeded successfully!`, categories: categories.length, blogsAdded: createdCount });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
};
