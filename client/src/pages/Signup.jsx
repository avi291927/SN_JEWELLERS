import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/ui/Toast';

const Signup = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signup, isUserLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { toasts, success, error } = useToast();

    useEffect(() => {
        document.title = 'Create Account — SN Jewellers';
        if (isUserLoggedIn) navigate('/');
    }, [isUserLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await signup(form);
            success('Account created successfully! Please check your email to verify.');
            // Redirect to sign-in page after successful signup
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            error(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-pro">
            <Toast toasts={toasts} />

            {/* Left decorative panel */}
            <div className="auth-brand-panel">
                <div className="auth-brand-overlay"></div>
                <div className="auth-brand-content">
                    <Link to="/" className="auth-brand-logo">
                        <div className="auth-brand-logo-mark">SN</div>
                    </Link>
                    <div className="auth-brand-text">
                        <h1>Join the<br /><span>SN Family</span></h1>
                        <p>Create your account and step into a world of exquisite craftsmanship, exclusive offers, and timeless beauty.</p>
                    </div>
                    <div className="auth-brand-features">
                        <div className="auth-brand-feature">
                            <div className="auth-brand-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </div>
                            <span>Early Access to New Collections</span>
                        </div>
                        <div className="auth-brand-feature">
                            <div className="auth-brand-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <span>Personalised Recommendations</span>
                        </div>
                        <div className="auth-brand-feature">
                            <div className="auth-brand-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                                </svg>
                            </div>
                            <span>Priority Customer Support</span>
                        </div>
                    </div>
                    <div className="auth-brand-decorative">
                        <div className="auth-deco-ring"></div>
                        <div className="auth-deco-ring auth-deco-ring-2"></div>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-form-panel">
                <div className="auth-form-container slide-up">
                    <div className="auth-form-header">
                        <div className="auth-form-mobile-logo">
                            <Link to="/">
                                <div className="logo-mark">SN</div>
                            </Link>
                        </div>
                        <h2>Create Account</h2>
                        <p>Join SN Jewellers for an exclusive experience</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="signup-name">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                </svg>
                                Full Name
                            </label>
                            <input
                                id="signup-name"
                                type="text"
                                className="auth-input"
                                placeholder="Your full name"
                                required
                                value={form.name}
                                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                autoComplete="name"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="signup-email">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                </svg>
                                Email Address
                            </label>
                            <input
                                id="signup-email"
                                type="email"
                                className="auth-input"
                                placeholder="your@email.com"
                                required
                                value={form.email}
                                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="signup-phone">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                Phone Number
                            </label>
                            <input
                                id="signup-phone"
                                type="tel"
                                className="auth-input"
                                placeholder="+91 XXXXX XXXXX"
                                value={form.phone}
                                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                autoComplete="tel"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="signup-password">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Password
                            </label>
                            <div className="auth-input-password-wrap">
                                <input
                                    id="signup-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="auth-input"
                                    placeholder="Minimum 6 characters"
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <span className="auth-input-hint">Must be at least 6 characters</span>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="auth-btn-spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-form-footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
