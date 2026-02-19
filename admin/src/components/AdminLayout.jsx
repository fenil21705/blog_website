import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, LogOut, Feather, PlusCircle, Grid, Users } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const menuItems = [
        { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { title: 'Posts', icon: <FileText size={20} />, path: '/posts' },
        { title: 'Categories', icon: <Grid size={20} />, path: '/categories' },

        { title: 'Users', icon: <Users size={20} />, path: '/users' },
    ];


    return (
        <div className="admin-container">
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.2rem', marginBottom: '3rem' }}>
                    <Feather size={24} />
                    <span>ADMIN</span>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            to={item.path}
                            className="btn btn-outline"
                            style={{
                                justifyContent: 'flex-start',
                                border: 'none',
                                background: location.pathname === item.path ? 'var(--bg-accent)' : 'transparent',
                                color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            {item.icon} {item.title}
                        </Link>
                    ))}
                    <Link
                        to="/editor"
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', justifyContent: 'flex-start' }}
                    >
                        <PlusCircle size={20} /> New Post
                    </Link>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'flex-start', border: 'none', color: 'var(--danger)' }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
