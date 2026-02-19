import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { Clock, User, ArrowRight } from 'lucide-react';

const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    return `${Math.ceil(minutes)} min read`;
};

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [longLoading, setLongLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLongLoading(true), 2000);
        const fetchContent = async () => {
            try {
                const [blogsRes, catsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/blogs`),
                    axios.get(`${API_URL}/api/categories`)
                ]);
                setBlogs(blogsRes.data);
                setCategories(catsRes.data);
                setLoading(false);
                clearTimeout(timer);
            } catch (error) {
                console.error('Error fetching content:', error);
                setLoading(false);
                clearTimeout(timer);
            }
        };
        fetchContent();
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '8rem' }}>
                <div className="skeleton" style={{ width: '100%', height: '300px', borderRadius: '24px', marginBottom: '4rem' }}></div>
                <div className="blog-grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton" style={{ height: '400px', borderRadius: '20px' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    const featuredBlogs = Array.isArray(blogs) ? blogs.slice(0, 3) : [];
    const latestBlogs = Array.isArray(blogs) ? blogs.slice(3, 9) : [];

    return (
        <div>
            {/* HERO */}
            <section className="hero-spacing">
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-title gradient-text"
                    >
                        Insights for the <br className="mobile-hide" /> Modern Creator.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="hero-desc"
                        style={{ marginTop: '1.5rem' }}
                    >
                        Exploring the intersection of technology, minimalism, and high-quality digital lifestyle.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mobile-stack"
                        style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '1rem' }}
                    >
                        <a href="#latest" className="btn btn-primary" style={{ padding: '0 3rem' }}>Latest Stories</a>
                        <Link to="/categories" className="btn btn-outline" style={{ padding: '0 3rem' }}>Explore All</Link>
                    </motion.div>
                </div>
            </section>

            {/* CATEGORIES BAR */}
            <div className="container" style={{ marginBottom: '6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            to="/categories"
                            className="glass"
                            style={{ padding: '0.6rem 1.4rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600, background: '#f4f4f5', border: '1px solid rgba(0,0,0,0.05)' }}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* FEATURED FEED */}
            <section id="latest" className="container" style={{ paddingBottom: '8rem' }}>
                <div className="flex-between mobile-stack" style={{ marginBottom: '4rem', alignItems: 'flex-end' }}>
                    <div className="mobile-center">
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '2px' }}>TRENDING</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Latest Stories</h2>
                    </div>
                    <Link to="/categories" style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        View All <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="blog-grid">
                    {featuredBlogs.map((blog, index) => (
                        <motion.div
                            key={blog.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="premium-card"
                        >
                            <Link to={`/blog/${blog.slug}`}>
                                <div style={{ height: '260px', overflow: 'hidden' }}>
                                    <img
                                        src={blog.featuredImage?.startsWith('/') ? `${API_URL}${blog.featuredImage}` : blog.featuredImage}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', fontWeight: 800, marginBottom: '1rem', opacity: 0.5 }}>
                                        <span style={{ textTransform: 'uppercase' }}>{blog.category}</span>
                                        <span>•</span>
                                        <span>{calculateReadingTime(blog.content || '')}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: 1.3 }}>{blog.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                        {blog.excerpt || 'Dive into this story and explore the details...'}
                                    </p>
                                    <div style={{ fontWeight: 800, fontSize: '0.85rem', borderBottom: '2px solid #000', width: 'fit-content' }}>Read Post</div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CURATOR SECTION */}
            <section style={{ background: 'var(--bg-secondary)', padding: '6rem 0' }}>
                <div className="container">
                    <div className="grid-2 mobile-stack" style={{ alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <div style={{ height: '420px', borderRadius: '32px', overflow: 'hidden' }}>
                                <img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="glass mobile-hide" style={{ position: 'absolute', bottom: '-20px', right: '-20px', padding: '2rem', borderRadius: '24px', maxWidth: '280px' }}>
                                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', opacity: 0.7 }}>"Great design is a letter to the future."</p>
                            </div>
                        </div>
                        <div className="mobile-center">
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>The <span className="gradient-text">Curator.</span></h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                                I’m a digital designer and minimalist. I write about high-end tech, timeless design, and building a meaningful digital life.
                            </p>
                            <Link to="/about" className="btn btn-primary" style={{ padding: '0 3rem' }}>Learn More</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="container" style={{ padding: '8rem 0' }}>
                <div className="glass" style={{ background: '#000', color: '#fff', padding: '6rem 2rem', borderRadius: '40px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>The Weekly Digest</h2>
                    <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto 3rem auto' }}>Join 50,000+ creators and get the best stories in your inbox every Sunday.</p>
                    <form className="mobile-stack" style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto', width: '100%', alignItems: 'center' }} onSubmit={e => e.preventDefault()}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                style={{
                                    width: '100%',
                                    height: '60px',
                                    borderRadius: '16px',
                                    padding: '0 1.5rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    color: '#fff',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    display: 'block'
                                }}
                            />
                        </div>
                        <button
                            className="btn"
                            style={{
                                background: '#fff',
                                color: '#000',
                                padding: '0 2.5rem',
                                height: '60px',
                                borderRadius: '16px',
                                fontWeight: 800,
                                fontSize: '1rem',
                                flexShrink: 0
                            }}
                        >
                            Subscribe Now
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;
