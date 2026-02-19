import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Feather, X, LogOut, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo') || '{}'));
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleAuth = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
            setUserInfo(JSON.parse(localStorage.getItem('userInfo') || '{}'));
        };
        window.addEventListener('authChange', handleAuth);
        return () => window.removeEventListener('authChange', handleAuth);
    }, []);

    useEffect(() => {
        // Simple and robust overflow control
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
        }
    }, [isMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setIsMenuOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event('authChange'));
        setIsMenuOpen(false);
        navigate('/login');
    };

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/categories' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <>
            <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '0.75rem 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.25rem' }}>
                        <Feather size={26} />
                        <span className="gradient-text">MODERN BLOG</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            {links.map(l => {
                                const isActive = location.pathname === l.path;
                                return (
                                    <Link
                                        key={l.path}
                                        to={l.path}
                                        style={{
                                            fontSize: '0.9rem',
                                            fontWeight: isActive ? 800 : 500,
                                            color: '#000',
                                            opacity: isActive ? 1 : 0.5,
                                            transition: '0.3s',
                                            position: 'relative',
                                            padding: '0.5rem 0'
                                        }}
                                    >
                                        {l.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNav"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '2px',
                                                    background: '#000',
                                                    borderRadius: '2px'
                                                }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                        <div style={{ width: '1px', height: '24px', background: '#000', opacity: 0.1 }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Search size={20} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setIsSearchOpen(true)} />
                            {isLoggedIn ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                                            {userInfo.username?.[0].toUpperCase()}
                                        </div>
                                        <span style={{ fontWeight: 700 }}>{userInfo.username}</span>
                                    </Link>
                                    <button onClick={handleLogout} style={{ background: 'none', opacity: 0.4 }}><LogOut size={20} /></button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn btn-primary" style={{ padding: '0 1.5rem', height: '42px', borderRadius: '50px', fontSize: '0.85rem' }}>Join</Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Icons */}
                    <div className="desktop-hide-icons" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div onClick={() => setIsSearchOpen(true)} style={{ padding: '0.5rem', opacity: 0.7 }}><Search size={22} /></div>
                        <div onClick={() => setIsMenuOpen(true)} style={{ padding: '0.5rem', opacity: 0.7 }}><Menu size={24} /></div>
                    </div>
                </div>

            </nav>
            {/* FULLSCREEN MOBILE SEARCH */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        <button style={{ position: 'absolute', top: '2rem', right: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '50%' }} onClick={() => setIsSearchOpen(false)}><X size={32} /></button>
                        <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '600px' }}>
                            <input autoFocus type="text" className="input-field" placeholder="Search stories..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ fontSize: '1.5rem', padding: '1.5rem', textAlign: 'center', border: 'none', borderBottom: '2px solid #000', borderRadius: 0, width: '100%', outline: 'none' }} />
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SOLID MOBILE MENU */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} style={{ position: 'fixed', inset: 0, background: '#ffffff', zIndex: 10000, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                            <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                                <Feather size={24} /> MODERN BLOG
                            </Link>
                            <button onClick={() => setIsMenuOpen(false)} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '50%' }}><X size={26} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {links.map(l => {
                                const isActive = location.pathname === l.path;
                                return (
                                    <Link
                                        key={l.path}
                                        to={l.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        style={{
                                            fontSize: '1.75rem',
                                            fontWeight: isActive ? 800 : 500,
                                            opacity: isActive ? 1 : 0.4,
                                            padding: '1.25rem 0',
                                            borderBottom: '1px solid rgba(0,0,0,0.06)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: '0.3s'
                                        }}
                                    >
                                        {l.name} <ChevronRight size={24} style={{ opacity: isActive ? 1 : 0.2 }} />
                                    </Link>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: 'auto', paddingBottom: '2rem' }}>
                            {isLoggedIn ? (
                                <div style={{ paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                                            {userInfo.username?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{userInfo.username}</div>
                                            <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>Profile Settings</div>
                                        </div>
                                    </Link>
                                    <button onClick={handleLogout} style={{ color: 'var(--danger)', fontWeight: 800, padding: '0.6rem 1.2rem', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '0.85rem' }}>Logout</button>
                                </div>
                            ) : (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', height: '60px' }}>Join the Inner Circle</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (min-width: 901px) { .desktop-hide-icons { display: none !important; } }
                @media (max-width: 900px) { .mobile-hide { display: none !important; } }
            `}</style>
        </>
    );
};

export default Navbar;
