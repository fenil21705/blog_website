const { User, Category, Blog, sequelize } = require('../models');

const seed = async () => {
    try {
        console.log('Syncing database...');
        await sequelize.sync({ force: false });

        console.log('Creating Categories...');
        const categories = [
            { name: 'Technology', slug: 'technology' },
            { name: 'Design', slug: 'design' },
            { name: 'Lifestyle', slug: 'lifestyle' },
            { name: 'Travel', slug: 'travel' },
            { name: 'Coding', slug: 'coding' }
        ];

        const catMap = {};
        for (const c of categories) {
            const [cat] = await Category.findOrCreate({
                where: { name: c.name },
                defaults: c
            });
            catMap[c.name] = cat.id;
        }

        console.log('Ensuring Admin User...');
        let admin = await User.findOne({ where: { role: 'admin' } });
        if (!admin) {
            // Only create if not exists
            admin = await User.create({
                username: 'admin',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin'
            });
            console.log('Admin user created: admin@test.com / password123');
        } else {
            console.log('Admin user found.');
        }

        console.log('Creating Sample Blogs...');
        const blogs = [
            {
                title: "The Future of Web Development",
                content: `<p>Web development is evolving rapidly. From <strong>AI-assisted coding</strong> to the rise of <em>Serverless Architecture</em>, the landscape is changing.</p><p>In this post, we explore how newer frameworks like React 19 and Next.js are shaping the future.</p>`,
                excerpt: "Explore the latest trends in web development, from AI tools to serverless architectures.",
                slug: "future-of-web-development",
                categoryId: catMap['Technology'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072"
            },
            {
                title: "Minimalism in UI Design",
                content: `<p>Less is more. That's the mantra of <strong>Minimalism</strong>.</p><p>Good design is not about adding more elements, but about removing the unnecessary ones until only the essential remains.</p>`,
                excerpt: "Why less is more in modern user interface design and how to achieve it.",
                slug: "minimalism-in-ui-design",
                categoryId: catMap['Design'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=2070"
            },
            {
                title: "10 Tips for a Productive Morning",
                content: `<p>How you start your day determines how the rest of it goes.</p><ul><li>Wake up early</li><li>Drink water</li><li>Exercise</li><li>Plan your day</li></ul>`,
                excerpt: "Transform your daily routine with these simple yet effective morning habits.",
                slug: "10-tips-productive-morning",
                categoryId: catMap['Lifestyle'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1499750310159-5b5f096fd51b?auto=format&fit=crop&q=80&w=2070"
            },
            {
                title: "Traveling to Japan: A Guide",
                content: `<p>Japan is a country of contrasts. From the neon lights of Tokyo to the quiet temples of Kyoto.</p><p>This guide covers everything you need to know before your trip.</p>`,
                excerpt: "Everything you need to know before visiting the Land of the Rising Sun.",
                slug: "traveling-to-japan-guide",
                categoryId: catMap['Travel'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2070"
            },
            {
                title: "Understanding React Hooks",
                content: `<p>Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.</p>`,
                excerpt: "A deep dive into useState, useEffect, and custom hooks.",
                slug: "understanding-react-hooks",
                categoryId: catMap['Coding'],
                authorId: admin.id,
                featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2070"
            }
        ];

        for (const b of blogs) {
            // Check if blog exists by slug
            const existing = await Blog.findOne({ where: { slug: b.slug } });
            if (!existing) {
                // Find the category name for this blog
                const categoryName = Object.keys(catMap).find(key => catMap[key] === b.categoryId);
                await Blog.create({
                    ...b,
                    category: categoryName || 'Technology' // Fallback to avoid null
                });
                console.log(`Created blog: ${b.title}`);
            } else {
                console.log(`Skipped blog (exists): ${b.title}`);
            }
        }

        console.log('Seeding Complete! 🌱');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
