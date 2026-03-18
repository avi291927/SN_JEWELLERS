import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Star } from 'lucide-react';
import { enquiryAPI, feedbackAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/ui/Toast';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const { toasts, success, error } = useToast();
    const { user, profile } = useAuth();

    // Feedback state
    const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', rating: 5, message: '' });
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);

    useEffect(() => {
        document.title = 'Contact Us — SN Jewellers';
        // Pre-fill feedback form with user data if logged in
        if (user && profile) {
            setFeedbackForm(prev => ({ ...prev, name: profile.name || '', email: profile.email || user.email || '' }));
        }
    }, [user, profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await enquiryAPI.create(form);
            success('Your message has been sent successfully. We will get back to you shortly.');
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            error('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setSubmittingFeedback(true);
        try {
            await feedbackAPI.create({
                ...feedbackForm,
                user_id: user?.id || null
            });
            success('Thank you for your feedback! We truly appreciate it.');
            setFeedbackForm({ name: '', email: '', rating: 5, message: '' });
        } catch (err) {
            error('Failed to submit feedback. Please try again.');
        } finally {
            setSubmittingFeedback(false);
        }
    };

    return (
        <>
            <Toast toasts={toasts} />
            <div className="page-hero">
                <div className="container">
                    <span className="overline">Get in Touch</span>
                    <h1>Contact Us</h1>
                    <p>We would love to hear from you. Visit our store or send us a message.</p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'var(--space-3xl)' }}>
                        {/* Contact Info */}
                        <div>
                            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Visit Our Store</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
                                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                        background: 'var(--color-gold-pale)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <MapPin size={18} color="var(--color-gold)" />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '4px', fontSize: '0.95rem' }}>Store Address</h4>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                                            SN Jewellers<br />
                                            Porsa Road, Ambah — 476111<br />
                                            Morena, Madhya Pradesh
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                        background: 'var(--color-gold-pale)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Phone size={18} color="var(--color-gold)" />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '4px', fontSize: '0.95rem' }}>Phone</h4>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                                            <a href="tel:+919584708876" style={{ color: 'inherit', textDecoration: 'none' }}>+91 95847 08876</a><br />
                                            Neeraj Kumar Gupta (Owner)
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                        background: 'var(--color-gold-pale)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Mail size={18} color="var(--color-gold)" />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '4px', fontSize: '0.95rem' }}>Email</h4>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                                            <a href="mailto:aviralgupta.2919@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>aviralgupta.2919@gmail.com</a>
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                        background: 'var(--color-gold-pale)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Clock size={18} color="var(--color-gold)" />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '4px', fontSize: '0.95rem' }}>Store Hours</h4>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                                            Monday – Saturday: 10:00 AM – 8:00 PM<br />
                                            Sunday: 11:00 AM – 6:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Embed */}
                            <div style={{
                                marginTop: 'var(--space-2xl)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid var(--color-border)',
                                height: '200px',
                                background: 'var(--color-cream)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.3!2d78.2256!3d26.7015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976a3b5e4e6c6b7%3A0x1234567890abcdef!2sAmbah%2C+Morena%2C+Madhya+Pradesh+476111!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="SN Jewellers Location"
                                ></iframe>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div style={{
                            background: 'var(--color-cream)',
                            padding: 'var(--space-2xl)',
                            borderRadius: '16px',
                            border: '1px solid var(--color-border)'
                        }}>
                            <h3 style={{ marginBottom: 'var(--space-sm)' }}>Send Us a Message</h3>
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)', fontSize: '0.88rem' }}>
                                Have a question about our jewellery or need assistance? Fill out the form below.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Your Name</label>
                                        <input type="text" className="form-input" required placeholder="Your full name"
                                            value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-input" required placeholder="your@email.com"
                                            value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input type="tel" className="form-input" required placeholder="+91 XXXXX XXXXX"
                                        value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea className="form-input" rows="5" required placeholder="How can we help you?"
                                        value={form.message} onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
                                    <Send size={16} />
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feedback Section */}
            <section className="section" style={{ background: 'var(--color-cream)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="overline">We Value Your Opinion</span>
                        <h2>Share Your Feedback</h2>
                        <div className="section-divider"></div>
                        <p>Your feedback helps us improve our products and services. Let us know about your experience!</p>
                    </div>

                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        background: 'white',
                        padding: 'var(--space-2xl)',
                        borderRadius: '16px',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
                    }}>
                        <form onSubmit={handleFeedbackSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input type="text" className="form-input" required placeholder="Your full name"
                                        value={feedbackForm.name} onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" required placeholder="your@email.com"
                                        value={feedbackForm.email} onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Rating</label>
                                <div style={{ display: 'flex', gap: '8px', padding: '8px 0' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                                            onMouseEnter={() => setHoveredStar(star)}
                                            onMouseLeave={() => setHoveredStar(0)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                transition: 'transform 0.15s ease'
                                            }}
                                            title={`${star} star${star > 1 ? 's' : ''}`}
                                        >
                                            <Star
                                                size={28}
                                                fill={(hoveredStar || feedbackForm.rating) >= star ? '#F9A825' : 'none'}
                                                color={(hoveredStar || feedbackForm.rating) >= star ? '#F9A825' : '#ccc'}
                                                style={{ transition: 'all 0.15s ease' }}
                                            />
                                        </button>
                                    ))}
                                    <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                                        {feedbackForm.rating}/5
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Your Feedback</label>
                                <textarea className="form-input" rows="4" required placeholder="Tell us about your experience with SN Jewellers..."
                                    value={feedbackForm.message} onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submittingFeedback}>
                                <Star size={16} />
                                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
