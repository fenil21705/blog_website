import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { Save, X, Image as ImageIcon, Send, Trash2, ExternalLink } from 'lucide-react';

const BlogEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [showNewCatInput, setShowNewCatInput] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        categoryId: '',
        featuredImage: '',
        status: 'draft'
    });

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/categories`);
            setCategories(data);
            if (data.length > 0 && !id) {
                setFormData(prev => ({
                    ...prev,
                    category: data[0].name,
                    categoryId: data[0].id
                }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory) return;
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${API_URL}/api/categories`,
                { name: newCategory },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCategories([...categories, data]);
            setFormData({ ...formData, category: data.name, categoryId: data.id });
            setNewCategory('');
            setShowNewCatInput(false);
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleDeleteCategory = async () => {
        const catToDelete = categories.find(c => c.name === formData.category);
        if (!catToDelete) return;
        if (!window.confirm(`Are you sure you want to delete the category "${catToDelete.name}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/categories/${catToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedCats = categories.filter(c => c.id !== catToDelete.id);
            setCategories(updatedCats);
            if (updatedCats.length > 0) {
                setFormData({ ...formData, category: updatedCats[0].name, categoryId: updatedCats[0].id });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const fetchBlog = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/blogs/admin`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const blog = data.find(b => b.id === id);
            if (blog) {
                setFormData({
                    title: blog.title || '',
                    content: blog.content || '',
                    excerpt: blog.excerpt || '',
                    category: blog.category || '',
                    categoryId: blog.categoryId || '',
                    featuredImage: blog.featuredImage || '',
                    status: blog.status || 'draft'
                });
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            const selectedCat = categories.find(c => c.name === value);
            setFormData({
                ...formData,
                category: value,
                categoryId: selectedCat ? selectedCat.id : ''
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            const { data } = await axios.post(`${API_URL}/api/upload`, formDataUpload, config);
            setFormData({ ...formData, featuredImage: data });
            setUploading(false);
        } catch (error) {
            console.error('Upload failed', error);
            setUploading(false);
        }
    };

    const handleSubmit = async (e, customStatus = null) => {
        if (e) e.preventDefault();
        setLoading(true);

        const dataToSubmit = {
            ...formData,
            status: customStatus || formData.status
        };

        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            };
            if (id) {
                await axios.put(`${API_URL}/api/blogs/${id}`, dataToSubmit, config);
            } else {
                await axios.post(`${API_URL}/api/blogs`, dataToSubmit, config);
            }
            navigate('/posts');
        } catch (error) {
            console.error('Error saving blog:', error);
            setLoading(false);
            alert('Failed to save post. Please check all fields.');
        }
    };

    return (
        <div style={{ maxWidth: '900px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>{id ? 'Edit Post' : 'Create New Post'}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Craft your next story for the world</p>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button onClick={() => navigate('/posts')} className="btn btn-outline">
                        <X size={18} /> Cancel
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, 'draft')}
                        className="btn btn-outline"
                        disabled={loading}
                        style={{ background: '#fff' }}
                    >
                        <Save size={18} /> {loading ? '...' : 'Save as Draft'}
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e, 'published')}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        <Send size={18} /> {loading ? 'Saving...' : 'Publish Now'}
                    </button>
                </div>
            </header>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Post Title</label>
                        <input
                            name="title"
                            className="input-field"
                            style={{ fontSize: '1.5rem', fontWeight: 600 }}
                            placeholder="Enter title here..."
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Content (HTML supported)</label>
                        <textarea
                            name="content"
                            className="input-field"
                            style={{ minHeight: '400px', resize: 'vertical', fontFamily: 'Inter' }}
                            placeholder="Write your story..."
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Publishing Settings</h3>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to="/categories" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <ExternalLink size={12} /> Manage
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleDeleteCategory}
                                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0 }}
                                        title="Delete this category"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>

                            {!showNewCatInput ? (
                                <button
                                    type="button"
                                    onClick={() => setShowNewCatInput(true)}
                                    style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
                                >
                                    + Add New Category
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ marginBottom: 0, fontSize: '0.8rem', padding: '0.5rem' }}
                                        placeholder="Category name"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCategory}
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem', fontSize: '0.7rem' }}
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewCatInput(false)}
                                        className="btn btn-outline"
                                        style={{ padding: '0.5rem', fontSize: '0.7rem' }}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Featured Image</h3>
                            <div
                                style={{
                                    height: '150px',
                                    border: '2px dashed var(--border)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                {formData.featuredImage ? (
                                    <img src={formData.featuredImage.startsWith('/') ? `${API_URL}${formData.featuredImage}` : formData.featuredImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                ) : (
                                    <>
                                        <ImageIcon size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{uploading ? 'Uploading...' : 'No image selected'}</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <input
                                name="featuredImage"
                                className="input-field"
                                style={{ marginTop: '1rem', fontSize: '0.8rem' }}
                                placeholder="Or paste URL..."
                                value={formData.featuredImage}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Excerpt</h3>
                            <textarea
                                name="excerpt"
                                className="input-field"
                                style={{ minHeight: '100px', fontSize: '0.85rem' }}
                                placeholder="Brief summary..."
                                value={formData.excerpt}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogEditor;
