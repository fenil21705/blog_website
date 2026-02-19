import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Thank you! Your message has been sent (simulation).');
        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <div className="container" style={{ paddingBottom: '8rem' }}>
            <div className="mobile-center" style={{ textAlign: 'center', marginBottom: '5rem', paddingTop: '4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '2px' }}>CONTACT US</span>
                <h1 className="gradient-text hero-title" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>Get in Touch</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Have a story to share or a project in mind? We'd love to hear from you.</p>
            </div>

            <div className="grid-2 mobile-stack" style={{ gap: '4rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '16px' }}>
                            <Mail size={24} />
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>Email Us</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>hello@modernblog.com</p>
                        </div>
                    </div>
                    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '16px' }}>
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>Our Studio</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Creative District, NY 10012</p>
                        </div>
                    </div>

                    <div className="premium-card" style={{ padding: '2.5rem', borderRadius: '32px', background: '#000', color: '#fff' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Collaboration?</h3>
                        <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>We're always looking for talented creators to feature.</p>
                        <Link to="/about" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
                            Learn More <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass"
                    style={{ padding: '3rem', borderRadius: '40px', background: '#fff' }}
                >
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700 }}>Full Name</label>
                                <input type="text" className="input-field" placeholder="John Doe" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700 }}>Email Address</label>
                                <input type="email" className="input-field" placeholder="john@example.com" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700 }}>Your Message</label>
                                <textarea className="input-field" style={{ minHeight: '160px', resize: 'none' }} placeholder="Tell us about your project or story..." required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '60px' }}>
                                <Send size={20} /> Send Message
                            </button>
                        </div>
                        {status && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1.5rem', color: '#16a34a', textAlign: 'center', fontWeight: 700 }}>{status}</motion.p>}
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
