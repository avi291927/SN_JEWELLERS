import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { feedbackAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/ui/Toast';
import {
    LayoutDashboard, Package, MessageSquare, LogOut,
    Trash2, Star
} from 'lucide-react';

const ManageFeedback = () => {
    const { user, isAdminLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toasts, success, error } = useToast();

    useEffect(() => {
        document.title = 'Manage Feedback — SN Jewellers';
        if (!isAdminLoggedIn) {
            navigate('/admin/login');
            return;
        }
        fetchFeedback();
    }, [isAdminLoggedIn]);

    const fetchFeedback = async () => {
        try {
            const result = await feedbackAPI.getAll({ limit: 100 });
            setFeedbackList(result.feedback);
        } catch (err) {
            error('Failed to fetch feedback');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;
        try {
            await feedbackAPI.delete(id);
            success('Feedback deleted');
            fetchFeedback();
        } catch (err) {
            error('Failed to delete feedback');
        }
    };

    const handleLogout = async () => { await logout(); navigate('/'); };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={14}
                fill={i < rating ? '#F9A825' : 'none'}
                color={i < rating ? '#F9A825' : '#ccc'}
            />
        ));
    };

    if (!isAdminLoggedIn) return null;

    return (
        <div className="admin-layout">
            <Toast toasts={toasts} />
            <aside className="admin-sidebar">
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <Link to="/" className="logo footer-logo">
                        <div className="logo-mark" style={{ width: '36px', height: '36px', fontSize: '13px' }}>SN</div>
                        <div className="logo-text">
                            <span className="logo-name" style={{ fontSize: '0.9rem' }}>SN Jewellers</span>
                            <span className="logo-tagline" style={{ fontSize: '0.6rem' }}>Admin Panel</span>
                        </div>
                    </Link>
                </div>
                <nav>
                    <Link to="/admin" className="admin-sidebar-link"><LayoutDashboard size={18} /> Dashboard</Link>
                    <Link to="/admin/products" className="admin-sidebar-link"><Package size={18} /> Products</Link>
                    <Link to="/admin/enquiries" className="admin-sidebar-link"><MessageSquare size={18} /> Enquiries</Link>
                    <Link to="/admin/feedback" className="admin-sidebar-link active"><Star size={18} /> Feedback</Link>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-2xl)' }}>
                    <button onClick={handleLogout} className="admin-sidebar-link" style={{ width: '100%' }}><LogOut size={18} /> Logout</button>
                </div>
            </aside>

            <main className="admin-content">
                <div className="admin-page-header">
                    <div><h2>Customer Feedback</h2><p>View feedback submitted by customers</p></div>
                </div>

                {loading ? (
                    <div className="loading-spinner"><div className="spinner"></div></div>
                ) : feedbackList.length > 0 ? (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr><th>Customer</th><th>Email</th><th>Rating</th><th>Message</th><th>Date</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {feedbackList.map(fb => (
                                    <tr key={fb.id}>
                                        <td style={{ fontWeight: 500 }}>{fb.name}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{fb.email}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {renderStars(fb.rating)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.88rem' }}>
                                                {fb.message}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{formatDate(fb.created_at)}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="action-btn delete" onClick={() => handleDelete(fb.id)} title="Delete"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <Star size={48} /><h3>No Feedback Yet</h3>
                        <p>Customer feedback will appear here once submitted.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageFeedback;
