import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, Shield, Edit, Heart, MessageSquare, ChevronRight, X, Check, Loader2, Lock, Key, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [activity, setActivity] = useState({ likes: [], comments: [] });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const [userRes, activityRes] = await Promise.all([
                    axios.get(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_URL}/api/auth/activity`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setUser(userRes.data);
                setFormData({ username: userRes.data.username, email: userRes.data.email });
                setActivity(activityRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setError('Failed to load profile');
                setLoading(false);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        fetchData();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(`${API_URL}/api/auth/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({ ...user, ...data });
            setIsEditing(false);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo) {
                localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
            }
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        setIsUpdating(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/auth/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setSuccessMessage('Password changed successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Loading profile...</div>;
    if (!user) return (
        <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '2rem' }}>{error || 'Profile not found'}</h2>
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header className="mobile-center" style={{ marginBottom: '4rem' }}>
                    <h1 className="hero-title" style={{ fontWeight: 800, marginBottom: '1rem' }}>Your Profile</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage your account settings and view your activity.</p>
                </header>

                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                color: '#16a34a',
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '2rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Check size={18} /> {successMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid-2 mobile-stack" style={{ gap: '2rem' }}>
                    {/* Left Column: User Info Card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass"
                            style={{ padding: '2rem', borderRadius: '32px', textAlign: 'center' }}
                        >
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: '#000',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    boxShadow: 'var(--shadow-premium)'
                                }}>
                                    {user.username?.[0]?.toUpperCase()}
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        style={{
                                            position: 'absolute',
                                            bottom: '0',
                                            right: '0',
                                            background: '#fff',
                                            border: '1px solid var(--border-color)',
                                            padding: '0.6rem',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Edit size={16} />
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.form
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onSubmit={handleUpdateProfile}
                                        style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                    >
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>USERNAME</label>
                                            <input
                                                className="input-field"
                                                style={{ marginBottom: 0 }}
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>EMAIL</label>
                                            <input
                                                type="email"
                                                className="input-field"
                                                style={{ marginBottom: 0 }}
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        {error && !isChangingPassword && <div style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>{error}</div>}
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                            <button
                                                type="submit"
                                                disabled={isUpdating}
                                                className="btn btn-primary"
                                                style={{ flex: 1, height: '44px', borderRadius: '12px' }}
                                            >
                                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({ username: user.username, email: user.email });
                                                }}
                                                className="btn btn-outline"
                                                style={{ flex: 1, height: '44px', borderRadius: '12px' }}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{user.username}</h2>
                                        <span style={{
                                            padding: '0.4rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            background: 'var(--bg-accent)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '2rem'
                                        }}>
                                            {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                                            {user.role?.toUpperCase()}
                                        </span>

                                        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ color: 'var(--text-secondary)' }}><Mail size={20} /></div>
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>EMAIL ADDRESS</div>
                                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{user.email}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ color: 'var(--text-secondary)' }}><Calendar size={20} /></div>
                                                <div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MEMBER SINCE</div>
                                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{format(new Date(user.createdAt), 'MMMM d, yyyy')}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="btn btn-outline"
                                            style={{ width: '100%', marginTop: '3rem', borderRadius: '16px' }}
                                        >
                                            Edit Profile
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass"
                            style={{ padding: '2rem', borderRadius: '24px' }}
                        >
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lock size={18} /> Security
                            </h3>

                            <AnimatePresence mode="wait">
                                {isChangingPassword ? (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onSubmit={handleChangePassword}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                className="input-field"
                                                placeholder="Current Password"
                                                style={{ marginBottom: 0, paddingRight: '3rem' }}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '1rem',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                className="input-field"
                                                placeholder="New Password"
                                                style={{ marginBottom: 0, paddingRight: '3rem' }}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '1rem',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="input-field"
                                                placeholder="Confirm New Password"
                                                style={{ marginBottom: 0, paddingRight: '3rem' }}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '1rem',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {error && isChangingPassword && <div style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>{error}</div>}
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button type="submit" disabled={isUpdating} className="btn btn-primary" style={{ flex: 1, height: '44px' }}>
                                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : 'Update'}
                                            </button>
                                            <button type="button" onClick={() => setIsChangingPassword(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="btn btn-outline"
                                        style={{ width: '100%', fontSize: '0.9rem' }}
                                    >
                                        <Key size={16} style={{ marginRight: '0.5rem' }} /> Change Password
                                    </button>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Right Column: Activity / Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="grid-2 mobile-stack" style={{ gap: '2rem' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass"
                                style={{ padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                            >
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Heart size={28} fill="#ff4d4d" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activity.likes.length}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>LIKED STORIES</div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass"
                                style={{ padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                            >
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MessageSquare size={28} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activity.comments.length}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>COMMENTS POSTED</div>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass"
                            style={{ padding: '2rem', borderRadius: '32px', flex: 1 }}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Recent Interactions
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Activity Feed</span>
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {activity.likes.length === 0 && activity.comments.length === 0 ? (
                                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', opacity: 0.5 }}>
                                        No recent activity to show.
                                    </div>
                                ) : (
                                    <>
                                        {activity.comments.slice(0, 3).map(comment => (
                                            <div key={comment.id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-accent)' }}>
                                                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}><MessageSquare size={18} /></div>
                                                <div>
                                                    <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                        Commented on <Link to={`/blog/${comment.Blog?.slug}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{comment.Blog?.title}</Link>
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{comment.content}"</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: 700 }}>{format(new Date(comment.createdAt), 'MMM d, yyyy')}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {activity.likes.slice(0, 3).map(blog => (
                                            <div key={blog.id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-accent)' }}>
                                                <div style={{ color: '#ff4d4d', marginTop: '0.2rem' }}><Heart size={18} fill="#ff4d4d" /></div>
                                                <div>
                                                    <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                                                        Liked <Link to={`/blog/${blog.slug}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{blog.title}</Link>
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: 700 }}>Recently Liked</div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
