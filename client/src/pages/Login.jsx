import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/ui/Toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, isUserLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { toasts, error } = useToast();

    useEffect(() => {
        document.title = 'Sign In — SN Jewellers';
        if (isUserLoggedIn) navigate('/');
    }, [isUserLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            error(err.message || 'Invalid email or password');
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
                        <h1>Welcome to<br /><span>SN Jewellers</span></h1>
                        <p>Discover timeless elegance in every piece. Sign in to explore our exclusive collections and personalized services.</p>
                    </div>
                    <div className="auth-brand-features">
                        <div className="auth-brand-feature">
                            <div className="auth-brand-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <span>Certified & Authentic Jewellery</span>
                        </div>
                        <div className="auth-brand-feature">
                            <div className="auth-brand-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" />
                                </svg>
                            </div>
                            <span>Exclusive Member Benefits</span>
                        </div>
                        <div className="auth-brand-feature">
                            <div className="auth-brand-feature-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </div>
                            <span>Handcrafted with Love</span>
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
                        <h2>Sign In</h2>
                        <p>Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="login-email">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                </svg>
                                Email Address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                className="auth-input"
                                placeholder="your@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="login-password">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Password
                            </label>
                            <div className="auth-input-password-wrap">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="auth-input"
                                    placeholder="Enter your password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
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
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="auth-btn-spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-form-footer">
                        <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
                    </div>
                    <div className="auth-admin-link">
                        <Link to="/admin/login">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Admin Portal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
