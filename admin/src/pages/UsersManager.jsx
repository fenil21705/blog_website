import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Trash2, User, Mail, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const UsersManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_URL}/api/auth`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                setError('Failed to load users');
            }
            setLoading(false);
        }

    };

    const handleDeleteUser = async (id, role) => {
        if (role === 'admin') {
            alert('Cannot delete admin users.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/auth/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading users...</div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Manage Users</h1>
                <p style={{ color: 'var(--text-secondary)' }}>View and manage registered users of the platform.</p>
            </header>

            {error && (
                <div style={{ background: 'rgba(255, 77, 77, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    {error}
                </div>
            )}

            <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: 'var(--bg-accent)' }}>
                            <th style={{ padding: '1.2rem', fontSize: '0.85rem' }}>USER</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.85rem' }}>ROLE</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.85rem' }}>PASSWORD (HASH)</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.85rem' }}>JOINED</th>
                            <th style={{ padding: '1.2rem', textAlign: 'right', fontSize: '0.85rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: u.role === 'admin' ? '#000' : 'var(--bg-accent)', color: u.role === 'admin' ? '#fff' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                            {u.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{u.username}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <Mail size={12} /> {u.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        background: u.role === 'admin' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.02)',
                                        color: u.role === 'admin' ? '#000' : 'var(--text-secondary)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}>
                                        {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.7rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {u.password}
                                </td>

                                <td style={{ padding: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={14} />
                                        {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                    {u.role !== 'admin' && (
                                        <button
                                            onClick={() => handleDeleteUser(u.id, u.role)}
                                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersManager;
