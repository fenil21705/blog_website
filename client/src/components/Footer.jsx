import React from 'react';
import { Feather, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="glass" style={{ marginTop: '4rem', padding: '4rem 0' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                            <Feather size={28} />
                            <span className="gradient-text">MODERN BLOG</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Defining the future of digital storytelling through premium content and modern design.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Experience</h4>
                        <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '2' }}>
                            <li>Stories</li>
                            <li>Archives</li>
                            <li>Podcasts</li>
                            <li>Membership</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '2' }}>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Cookie Policy</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Twitter size={20} style={{ opacity: 0.7, cursor: 'pointer' }} />
                            <Instagram size={20} style={{ opacity: 0.7, cursor: 'pointer' }} />
                            <Linkedin size={20} style={{ opacity: 0.7, cursor: 'pointer' }} />
                            <Mail size={20} style={{ opacity: 0.7, cursor: 'pointer' }} />
                        </div>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '4rem', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    © {new Date().getFullYear()} Modern Blog. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
