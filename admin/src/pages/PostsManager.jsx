import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Edit, Trash2, Eye, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostsManager = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_URL}/api/blogs/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlogs(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteBlog = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/api/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchBlogs();
            } catch (error) {
                console.error('Error deleting blog:', error);
            }
        }
    };

    if (loading) return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <div className="skeleton" style={{ width: '250px', height: '40px', marginBottom: '0.5rem' }}></div>
                    <div className="skeleton" style={{ width: '400px', height: '20px' }}></div>
                </div>
                <div className="skeleton" style={{ width: '180px', height: '45px', borderRadius: '12px' }}></div>
            </header>
            <div className="glass" style={{ borderRadius: '24px', padding: '1.5rem', marginBottom: '2rem' }}>
                <div className="skeleton" style={{ width: '100%', height: '45px', borderRadius: '12px' }}></div>
            </div>
            <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', padding: '0' }}>
                <table style={{ margin: 0, width: '100%' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-accent)' }}>
                            <th style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '100px', height: '20px' }}></div></th>
                            <th style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '80px', height: '20px' }}></div></th>
                            <th style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '60px', height: '20px' }}></div></th>
                            <th style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '120px', height: '20px' }}></div></th>
                            <th style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '100px', height: '20px', float: 'right' }}></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map(i => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '70%', height: '20px' }}></div></td>
                                <td style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '90px', height: '24px', borderRadius: '8px' }}></div></td>
                                <td style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '50px', height: '20px', borderRadius: '20px' }}></div></td>
                                <td style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '100px', height: '20px' }}></div></td>
                                <td style={{ padding: '1.2rem' }}><div className="skeleton" style={{ width: '120px', height: '30px', float: 'right' }}></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Manage Posts</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Create, edit, and manage all your blog posts.</p>
                </div>
                <Link to="/editor" className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '12px' }}>
                    <PlusCircle size={20} /> Create New Post
                </Link>
            </header>

            <div className="glass" style={{ borderRadius: '24px', padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="input-field"
                        style={{ marginBottom: 0, paddingLeft: '3rem', borderRadius: '12px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <table style={{ margin: 0 }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-accent)' }}>
                            <th style={{ padding: '1.2rem' }}>Post Title</th>
                            <th style={{ padding: '1.2rem' }}>Category</th>
                            <th style={{ padding: '1.2rem' }}>Status</th>
                            <th style={{ padding: '1.2rem' }}>Date Published</th>
                            <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filteredBlogs) && filteredBlogs.map((blog) => (
                            <tr key={blog?.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.2rem', fontWeight: 600 }}>{blog?.title || 'Untitled'}</td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-accent)', borderRadius: '8px', fontSize: '0.85rem' }}>
                                        {blog?.Category?.name || 'General'}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span className={`status-badge status-${blog?.status || 'draft'}`} style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                        {blog?.status || 'draft'}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem', color: 'var(--text-secondary)' }}>
                                    {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                </td>
                                <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                                        <a href={`http://localhost:5173/blog/${blog?.slug || ''}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                                            <Eye size={18} />
                                        </a>
                                        <Link to={`/editor/${blog?.id || ''}`} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => deleteBlog(blog?.id)}
                                            className="btn btn-outline"
                                            style={{ padding: '0.5rem', borderRadius: '8px', color: 'var(--danger)' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!Array.isArray(filteredBlogs) || filteredBlogs.length === 0) && (
                    <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p style={{ fontSize: '1.1rem' }}>{searchTerm ? 'No results found for your search.' : 'You haven\'t created any posts yet.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostsManager;
