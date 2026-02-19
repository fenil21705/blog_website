import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { motion } from 'framer-motion';
import { Mail, Lock, Feather, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.dispatchEvent(new Event('authChange'));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass auth-card"
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '20px', marginBottom: '1.5rem' }}>
                        <Feather size={32} />
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Continue your journey with us.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: 'rgba(255, 77, 77, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.85rem', textAlign: 'center' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ position: 'relative' }}>
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field input-with-icon"
                            style={{ marginBottom: 0 }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: '2rem', position: 'relative' }}>
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="input-field input-with-icon"
                            style={{ marginBottom: 0, paddingRight: '3rem' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
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
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                        <button
                            type="button"
                            onClick={() => alert('Please contact the administrator to reset your password.')}
                            style={{ background: 'none', border: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Forgot your password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', height: '56px', borderRadius: '16px' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#000', fontWeight: 700, textDecoration: 'none' }}>Join now</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
