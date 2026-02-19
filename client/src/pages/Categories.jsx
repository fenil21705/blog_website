import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { Clock, User, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const Categories = () => {
    const [blogs, setBlogs] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [dynamicCategories, setDynamicCategories] = useState(['All']);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [blogsRes, catsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/blogs`),
                    axios.get(`${API_URL}/api/categories`)
                ]);
                setBlogs(blogsRes.data);
                setDynamicCategories(['All', ...catsRes.data.map(c => c.name)]);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };
        fetchContent();
    }, []);

    const filteredBlogs = activeCategory === 'All'
        ? blogs
        : blogs.filter(blog => blog.category === activeCategory);

    return (
        <div className="container" style={{ paddingTop: '4rem' }}>
            <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gradient-text hero-title"
                    style={{ marginBottom: '1rem' }}
                >
                    Explore by Category
                </motion.h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                    {dynamicCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="glass"
                            style={{
                                padding: '0.8rem 1.5rem',
                                borderRadius: '30px',
                                color: activeCategory === cat ? '#000' : 'var(--text-secondary)',
                                background: activeCategory === cat ? 'rgba(0,0,0,0.05)' : 'var(--glass-bg)',
                                border: activeCategory === cat ? '1px solid #000' : '1px solid var(--border-color)',
                                transition: 'var(--transition)',
                                fontWeight: 500
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <div className="blog-grid" style={{ gap: '2rem' }}>
                {Array.isArray(filteredBlogs) && filteredBlogs.map((blog, index) => (
                    <motion.div
                        key={blog?.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="premium-card"
                    >
                        <Link to={`/blog/${blog?.slug || ''}`}>
                            <div style={{ height: '200px', overflow: 'hidden', background: '#f5f5f5' }}>
                                {blog?.featuredImage && typeof blog.featuredImage === 'string' ? (
                                    <img
                                        src={blog.featuredImage.startsWith('/') ? `${API_URL}${blog.featuredImage}` : blog.featuredImage}
                                        alt={blog.title || 'Blog Post'}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.8rem' }}>
                                        NO IMAGE
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{blog?.category || 'General'}</span>
                                    <ChevronRight size={16} style={{ opacity: 0.5 }} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{blog?.title || 'Untitled'}</h3>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
            {(!Array.isArray(filteredBlogs) || filteredBlogs.length === 0) && (
                <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                    No stories found in this category yet.
                </div>
            )}
        </div>
    );
};

export default Categories;
