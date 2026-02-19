import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight, Search as SearchIcon } from 'lucide-react';
import { format } from 'date-fns';

const calculateReadingTime = (text) => {
    if (!text) return '1 min read';
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = noOfWords / wordsPerMinute;
    return `${Math.ceil(minutes)} min read`;
};

const SearchResults = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_URL}/api/blogs`);
                // Since there's no dedicated search endpoint yet, we'll filter on frontend
                const filtered = data.filter(blog =>
                    blog.title.toLowerCase().includes(query?.toLowerCase() || '') ||
                    blog.content.toLowerCase().includes(query?.toLowerCase() || '') ||
                    blog.category.toLowerCase().includes(query?.toLowerCase() || '')
                );
                setBlogs(filtered);
                setLoading(false);
            } catch (error) {
                console.error('Error searching blogs:', error);
                setLoading(false);
            }
        };
        if (query) {
            fetchResults();
        } else {
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="container" style={{ paddingTop: '6rem', minHeight: '80vh' }}>
            <header style={{ marginBottom: '4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '2px' }}>SEARCH RESULTS FOR</span>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '0.5rem' }}>"{query}"</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Found {blogs.length} stories matching your search.</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Searching stories...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="premium-card"
                        >
                            <Link to={`/blog/${blog.slug}`}>
                                <div style={{ height: '240px', overflow: 'hidden', background: '#f5f5f5', borderRadius: '20px' }}>
                                    {blog.featuredImage ? (
                                        <img
                                            src={blog.featuredImage.startsWith('/') ? `${API_URL}${blog.featuredImage}` : blog.featuredImage}
                                            alt={blog.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>NO IMAGE</div>
                                    )}
                                </div>
                                <div style={{ padding: '2rem 1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                        <span>{blog.category}</span>
                                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ccc' }}></span>
                                        <span>{calculateReadingTime(blog.content)}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', lineHeight: 1.3, marginBottom: '1rem', fontWeight: 700 }}>{blog.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {blog.excerpt}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Read Story <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && blogs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '6rem 0', background: '#fafafa', borderRadius: '30px' }}>
                    <SearchIcon size={48} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>No stories found matching your query.</h2>
                    <p style={{ marginTop: '1rem' }}>Try searching for a different keyword or browse categories.</p>
                    <Link to="/categories" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>Browse Categories</Link>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
