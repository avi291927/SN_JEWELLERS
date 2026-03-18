import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI, enquiryAPI, feedbackAPI } from '../../services/api';
import {
    LayoutDashboard, Package, MessageSquare, LogOut,
    PlusCircle, Gem, Star
} from 'lucide-react';

const Dashboard = () => {
    const { user, profile, isAdminLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalProducts: 0, goldProducts: 0, silverProducts: 0, featuredProducts: 0 });
    const [enquiryStats, setEnquiryStats] = useState({ total: 0, new: 0, read: 0, replied: 0 });
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Admin Dashboard — SN Jewellers';
        if (!isAdminLoggedIn) {
            navigate('/admin/login');
            return;
        }
        const fetchStats = async () => {
            try {
                const [prodStats, enqStats, fbCount] = await Promise.all([
                    productAPI.getStats(),
                    enquiryAPI.getStats(),
                    feedbackAPI.getCount()
                ]);
                setStats(prodStats);
                setEnquiryStats(enqStats);
                setFeedbackCount(fbCount);
            } catch (err) {
                console.error('Error fetching stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [isAdminLoggedIn, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!isAdminLoggedIn) return null;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <Link to="/" className="logo footer-logo" style={{ marginBottom: 'var(--space-md)' }}>
                        <div className="logo-mark" style={{ width: '36px', height: '36px', fontSize: '13px' }}>SN</div>
                        <div className="logo-text">
                            <span className="logo-name" style={{ fontSize: '0.9rem' }}>SN Jewellers</span>
                            <span className="logo-tagline" style={{ fontSize: '0.6rem' }}>Admin Panel</span>
                        </div>
                    </Link>
                </div>
                <nav>
                    <Link to="/admin" className="admin-sidebar-link active"><LayoutDashboard size={18} /> Dashboard</Link>
                    <Link to="/admin/products" className="admin-sidebar-link"><Package size={18} /> Products</Link>
                    <Link to="/admin/enquiries" className="admin-sidebar-link">
                        <MessageSquare size={18} /> Enquiries
                        {enquiryStats.new > 0 && <span className="status-badge status-new" style={{ marginLeft: 'auto' }}>{enquiryStats.new}</span>}
                    </Link>
                    <Link to="/admin/feedback" className="admin-sidebar-link">
                        <Star size={18} /> Feedback
                        {feedbackCount > 0 && <span className="status-badge status-new" style={{ marginLeft: 'auto' }}>{feedbackCount}</span>}
                    </Link>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-2xl)' }}>
                    <button onClick={handleLogout} className="admin-sidebar-link" style={{ width: '100%' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <div className="admin-page-header">
                    <h2>Dashboard</h2>
                    <p>Welcome back, {profile?.name || user.email}. Here is an overview of your store.</p>
                </div>

                {loading ? (
                    <div className="loading-spinner"><div className="spinner"></div></div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon gold"><Package size={22} /></div>
                                <div className="stat-value">{stats.totalProducts}</div>
                                <div className="stat-label">Total Products</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#FFF8E1', color: '#F9A825' }}><Gem size={22} /></div>
                                <div className="stat-value">{stats.goldProducts}</div>
                                <div className="stat-label">Gold Products</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon dark"><Gem size={22} /></div>
                                <div className="stat-value">{stats.silverProducts}</div>
                                <div className="stat-label">Silver Products</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon blue"><MessageSquare size={22} /></div>
                                <div className="stat-value">{enquiryStats.total}</div>
                                <div className="stat-label">Total Enquiries</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                            <div className="stat-card">
                                <h4 style={{ marginBottom: 'var(--space-lg)' }}>Enquiry Overview</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>New Enquiries</span>
                                        <span className="status-badge status-new">{enquiryStats.new}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Read</span>
                                        <span className="status-badge status-read">{enquiryStats.read}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Replied</span>
                                        <span className="status-badge status-replied">{enquiryStats.replied}</span>
                                    </div>
                                </div>
                                <Link to="/admin/enquiries" className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-lg)', width: '100%' }}>View All Enquiries</Link>
                            </div>

                            <div className="stat-card">
                                <h4 style={{ marginBottom: 'var(--space-lg)' }}>Quick Actions</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                    <Link to="/admin/products?action=add" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                                        <PlusCircle size={14} /> Add New Product
                                    </Link>
                                    <Link to="/admin/products" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                                        <Package size={14} /> Manage Products
                                    </Link>
                                    <Link to="/admin/enquiries" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                                        <MessageSquare size={14} /> Manage Enquiries
                                    </Link>
                                    <Link to="/admin/feedback" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                                        <Star size={14} /> View Feedback
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
