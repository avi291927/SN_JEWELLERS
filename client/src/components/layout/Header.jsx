import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, LayoutDashboard } from 'lucide-react';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout, isAdmin, isAdminLoggedIn, isUserLoggedIn } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const isActive = (path) => location.pathname === path;

    // Hide header on admin pages
    if (location.pathname.startsWith('/admin')) return null;

    const handleLogout = async () => {
        await logout();
    };

    // Show user as logged in only if they're a regular user logged in via user portal
    // OR if admin is browsing the public site (show dashboard link)
    const showLoggedInState = isUserLoggedIn || isAdminLoggedIn;

    return (
        <>
            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-inner">
                    <Link to="/" className="logo">
                        <div className="logo-mark">SN</div>
                        <div className="logo-text">
                            <span className="logo-name">SN Jewellers</span>
                            <span className="logo-tagline">Fine Jewellery</span>
                        </div>
                    </Link>

                    <nav className="nav">
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                        <Link to="/collections/gold" className={`nav-link ${location.pathname.includes('/gold') ? 'active' : ''}`}>Gold</Link>
                        <Link to="/collections/silver" className={`nav-link ${location.pathname.includes('/silver') ? 'active' : ''}`}>Silver</Link>
                        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
                        <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
                    </nav>

                    <div className="nav-actions">
                        {showLoggedInState ? (
                            <>
                                {isAdminLoggedIn && (
                                    <Link to="/admin" className="btn btn-sm btn-outline">
                                        <LayoutDashboard size={14} />
                                        Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-sm btn-outline">
                                <User size={14} />
                                Sign In
                            </Link>
                        )}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </header>

            <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/collections/gold" className="nav-link">Gold Jewellery</Link>
                <Link to="/collections/silver" className="nav-link">Silver Jewellery</Link>
                <Link to="/about" className="nav-link">About Us</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
                {showLoggedInState ? (
                    <>
                        {isAdminLoggedIn && <Link to="/admin" className="nav-link">Admin Dashboard</Link>}
                        <button onClick={handleLogout} className="nav-link" style={{ textAlign: 'left' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Sign In</Link>
                        <Link to="/signup" className="nav-link">Create Account</Link>
                    </>
                )}
            </div>
        </>
    );
};

export default Header;
