import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, ArrowRight } from 'lucide-react';

const About = () => {
    return (
        <div className="container" style={{ paddingBottom: '6rem' }}>
            <div className="grid-2 mobile-stack" style={{ alignItems: 'center', paddingTop: '4rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.75rem' }}>OUR MISSION</span>
                    <h1 className="hero-title gradient-text" style={{ margin: '1.5rem 0' }}>
                        Crafting Digital Narratives for the Modern Age.
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '3rem', maxWidth: '540px' }}>
                        Welcome to Modern Blog, a curated space where technology meets design and lifestyle. We believe that stories should not only be read but experienced.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <Zap size={28} style={{ marginBottom: '1rem' }} />
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Innovative</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Always chasing the next frontier in digital experiences.</p>
                        </div>
                        <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <Award size={28} style={{ marginBottom: '1rem' }} />
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Premium</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Focusing on high-quality content and aesthetics.</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                    <div className="premium-card" style={{ height: '500px', width: '100%', maxWidth: '500px', overflow: 'hidden', borderRadius: '40px' }}>
                        <img
                            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"
                            alt="Premium Office"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="glass mobile-hide" style={{ position: 'absolute', bottom: '-20px', right: '-20px', padding: '2.5rem', borderRadius: '32px', maxWidth: '240px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>50k+</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Monthly readers who value premium digital storytelling.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
