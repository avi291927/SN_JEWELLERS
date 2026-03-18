import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enquiryAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/ui/Toast';
import {
    LayoutDashboard, Package, MessageSquare, LogOut,
    Trash2, Eye, CheckCircle, Mail, Star
} from 'lucide-react';

const ManageEnquiries = () => {
    const { user, isAdminLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const { toasts, success, error } = useToast();

    useEffect(() => {
        document.title = 'Manage Enquiries — SN Jewellers';
        if (!isAdminLoggedIn) {
            navigate('/admin/login');
            return;
        }
        fetchEnquiries();
    }, [isAdminLoggedIn, filter]);

    const fetchEnquiries = async () => {
        try {
            const params = { limit: 100 };
            if (filter) params.status = filter;
            const result = await enquiryAPI.getAll(params);
            setEnquiries(result.enquiries);
        } catch (err) {
            error('Failed to fetch enquiries');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await enquiryAPI.updateStatus(id, status);
            success(`Enquiry marked as ${status}`);
            fetchEnquiries();
        } catch (err) {
            error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
        try {
            await enquiryAPI.delete(id);
            success('Enquiry deleted');
            fetchEnquiries();
        } catch (err) {
            error('Failed to delete enquiry');
        }
    };

    const handleLogout = async () => { await logout(); navigate('/'); };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
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
                    <Link to="/admin/enquiries" className="admin-sidebar-link active"><MessageSquare size={18} /> Enquiries</Link>
                    <Link to="/admin/feedback" className="admin-sidebar-link"><Star size={18} /> Feedback</Link>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-2xl)' }}>
                    <button onClick={handleLogout} className="admin-sidebar-link" style={{ width: '100%' }}><LogOut size={18} /> Logout</button>
                </div>
            </aside>

            <main className="admin-content">
                <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div><h2>Enquiries</h2><p>View and manage customer enquiries</p></div>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                        {['', 'new', 'read', 'replied'].map(s => (
                            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)}>
                                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner"><div className="spinner"></div></div>
                ) : enquiries.length > 0 ? (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr><th>Customer</th><th>Contact</th><th>Message</th><th>Product</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {enquiries.map(enq => (
                                    <tr key={enq.id}>
                                        <td style={{ fontWeight: 500 }}>{enq.name}</td>
                                        <td>
                                            <div style={{ fontSize: '0.82rem' }}>
                                                <div>{enq.email}</div>
                                                <div style={{ color: 'var(--color-text-light)' }}>{enq.phone}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.88rem' }}>
                                                {enq.message}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>{enq.products ? enq.products.name : '—'}</td>
                                        <td><span className={`status-badge status-${enq.status}`}>{enq.status}</span></td>
                                        <td style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{formatDate(enq.created_at)}</td>
                                        <td>
                                            <div className="action-btns">
                                                {enq.status === 'new' && <button className="action-btn" onClick={() => updateStatus(enq.id, 'read')} title="Mark as Read"><Eye size={15} /></button>}
                                                {enq.status !== 'replied' && <button className="action-btn" onClick={() => updateStatus(enq.id, 'replied')} title="Mark as Replied"><CheckCircle size={15} /></button>}
                                                <button className="action-btn delete" onClick={() => handleDelete(enq.id)} title="Delete"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <Mail size={48} /><h3>No Enquiries</h3>
                        <p>{filter ? `No ${filter} enquiries found.` : 'No customer enquiries yet.'}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageEnquiries;
