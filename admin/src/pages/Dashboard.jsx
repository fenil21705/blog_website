import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { FileText, Users, MessageSquare, Heart, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard insights...</div>;

    const stats = [
        { title: 'Total Posts', value: data?.stats.totalPosts, icon: <FileText size={24} />, color: '#4dabf7' },
        { title: 'Total Users', value: data?.stats.totalUsers, icon: <Users size={24} />, color: '#63e6be' },
        { title: 'Total Comments', value: data?.stats.totalComments, icon: <MessageSquare size={24} />, color: '#ff922b' },
        { title: 'Total Likes', value: data?.stats.totalLikes, icon: <Heart size={24} />, color: '#ff6b6b' },
    ];

    return (
        <div>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Admin Overview</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome back! Here's what's happening on your platform.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {stats.map((stat, index) => (
                    <div key={index} className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1rem', borderRadius: '16px', background: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stat.value}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.title.toUpperCase()}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                {/* Recent Posts Section */}
                <div className="glass" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Recent Posts</h3>
                        <Link to="/posts" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {data?.recentPosts.map(post => (
                            <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'var(--bg-accent)', overflow: 'hidden' }}>
                                        <img src={post.featuredImage || 'https://via.placeholder.com/60'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{post.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Users size={14} /> {post.author?.username} • <Clock size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <span className={`status-badge status-${post.status}`} style={{ fontWeight: 700, fontSize: '0.65rem' }}>{post.status.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Integration Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'var(--accent)', color: '#fff' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Pro Tip!</h4>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            Regularly updating your blog with high-quality content keeps your audience engaged and improves SEO rankings.
                        </p>
                        <Link to="/editor" className="btn" style={{ width: '100%', background: '#fff', color: '#000', borderRadius: '12px', justifyContent: 'center' }}>
                            Write New Post
                        </Link>
                    </div>

                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={18} /> Quick Links
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link to="/categories" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', background: 'var(--bg-accent)', color: 'inherit' }}>
                                <span style={{ fontWeight: 600 }}>Manage Categories</span>
                                <ChevronRight size={16} />
                            </Link>
                            <Link to="/users" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', background: 'var(--bg-accent)', color: 'inherit' }}>
                                <span style={{ fontWeight: 600 }}>User Management</span>
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
