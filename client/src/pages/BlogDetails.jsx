import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, User, Calendar, Clock, Heart, MessageSquare, Send, Trash2, Twitter, Linkedin } from 'lucide-react';
import { format } from 'date-fns';

const calculateReadingTime = (text) => {
    if (!text) return '1 min read';
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    return `${Math.ceil(noOfWords / wordsPerMinute)} min read`;
};

const BlogDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [interactions, setInteractions] = useState({ likesCount: 0, userLiked: false, comments: [] });
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isLoggedIn = !!localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/blogs/${slug}`);
                setBlog(data);
                const token = localStorage.getItem('token');
                const iRes = await axios.get(`${API_URL}/api/blogs/${data.id}/interactions`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setInteractions(iRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    const handleLike = async () => {
        if (!isLoggedIn) return navigate('/login');
        try {
            const { data } = await axios.post(`${API_URL}/api/blogs/${blog.id}/like`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setInteractions(p => ({ ...p, userLiked: data.liked, likesCount: data.liked ? p.likesCount + 1 : p.likesCount - 1 }));
        } catch (err) { console.error(err); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return navigate('/login');
        if (!commentText.trim()) return;
        setIsSubmitting(true);
        try {
            const { data } = await axios.post(`${API_URL}/api/blogs/${blog.id}/comments`, { content: commentText }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setInteractions(p => ({ ...p, comments: [data, ...p.comments] }));
            setCommentText('');
        } catch (err) { console.error(err); }
        finally { setIsSubmitting(false); }
    };

    if (loading) return <div className="container" style={{ paddingTop: '10rem' }}><div className="skeleton" style={{ height: '500px', borderRadius: '32px' }}></div></div>;
    if (!blog) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Blog not found.</div>;

    return (
        <article>
            <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: '#000', scaleX, originX: 0, zIndex: 10001 }} />

            {/* HEADER HERO */}
            <header style={{ position: 'relative', minHeight: '60vh', padding: '12rem 0 6rem 0', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                    <img
                        src={blog.featuredImage?.startsWith('/') ? `${API_URL}${blog.featuredImage}` : blog.featuredImage}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.9) 100%)' }}></div>
                </div>

                <div className="container" style={{ paddingBottom: '6rem' }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <Link to="/" style={{ color: '#fff', opacity: 0.8, fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                            <ArrowLeft size={16} /> BACK TO DISCOVER
                        </Link>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px' }}>{blog.category}</span>
                        <h1 className="hero-title" style={{ color: '#fff', margin: '1rem 0 2rem 0' }}>{blog.title}</h1>

                        <div className="mobile-stack" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={16} />
                                </div>
                                {blog.author?.username}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', opacity: 0.8 }}>
                                <Calendar size={18} />
                                {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', opacity: 0.8 }}>
                                <Clock size={18} />
                                {calculateReadingTime(blog.content)}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* CONTENT */}
            <div className="container" style={{ marginTop: '6rem' }}>
                <div className="details-layout">
                    <aside className="details-sidebar" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '50px', display: 'flex', gap: '1.5rem', alignItems: 'center', height: 'fit-content' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={handleLike}
                                style={{
                                    background: interactions.userLiked ? 'rgba(255,77,77,0.1)' : 'transparent',
                                    color: interactions.userLiked ? 'var(--danger)' : 'inherit',
                                    width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: interactions.userLiked ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                                    transition: '0.3s'
                                }}
                            >
                                <Heart size={22} fill={interactions.userLiked ? 'currentColor' : 'none'} />
                            </button>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{interactions.likesCount}</span>
                        </div>
                        <div className="divider-vertical" style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-outline" style={{ padding: '0.6rem', borderRadius: '50%', height: '40px', width: '40px', border: 'none', background: 'var(--bg-accent)' }}><Twitter size={18} /></button>
                            <button className="btn-outline" style={{ padding: '0.6rem', borderRadius: '50%', height: '40px', width: '40px', border: 'none', background: 'var(--bg-accent)' }}><Linkedin size={18} /></button>
                        </div>
                    </aside>

                    <div style={{ maxWidth: '820px' }}>
                        <div
                            className="blog-content"
                            style={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#333', whiteSpace: 'pre-wrap' }}
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* COMMENTS */}
                        <section style={{ marginTop: '8rem', borderTop: '2px solid var(--border-color)', paddingTop: '6rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <MessageSquare size={32} /> Comments ({interactions.comments.length})
                            </h2>

                            {isLoggedIn ? (
                                <form onSubmit={handleComment} style={{ marginBottom: '5rem' }}>
                                    <textarea
                                        className="input-field"
                                        placeholder="Add to the conversation..."
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        style={{ minHeight: '150px', resize: 'none', marginBottom: '1.5rem' }}
                                    />
                                    <button disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0 3rem' }}>
                                        {isSubmitting ? 'Posting...' : 'Post Comment'} <Send size={18} style={{ marginLeft: '0.5rem' }} />
                                    </button>
                                </form>
                            ) : (
                                <div className="glass" style={{ padding: '3rem', borderRadius: '24px', textAlign: 'center', marginBottom: '5rem' }}>
                                    <p style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Join the conversation to share your thoughts.</p>
                                    <Link to="/login" className="btn btn-primary">Sign In</Link>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                {interactions.comments.map(c => (
                                    <div key={c.id} style={{ display: 'flex', gap: '1.5rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                                            {c.user?.username[0].toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 800 }}>{c.user?.username}</span>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>{format(new Date(c.createdAt), 'MMM dd, yyyy')}</span>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)' }}>{c.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogDetails;
