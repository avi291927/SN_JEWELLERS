import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/ui/Toast';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { adminLogin, isAdminLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { toasts, error } = useToast();

    useEffect(() => {
        document.title = 'Admin Login — SN Jewellers';
        // Only redirect if actively logged in as admin
        if (isAdminLoggedIn) navigate('/admin');
    }, [isAdminLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminLogin(email, password);
            navigate('/admin');
        } catch (err) {
            error(err.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Toast toasts={toasts} />
            <div className="auth-card slide-up">
                <div className="auth-header">
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'var(--color-gold-pale)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-lg)'
                    }}>
                        <ShieldCheck size={24} color="var(--color-gold)" />
                    </div>
                    <h2>Admin Access</h2>
                    <p>Sign in with your administrator credentials</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="admin-email">Admin Email</label>
                        <input id="admin-email" type="email" className="form-input" placeholder="admin@snjewellers.com" required
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="admin-password">Password</label>
                        <input id="admin-password" type="password" className="form-input" placeholder="Enter admin password" required
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-dark btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </button>
                </form>
                <div className="auth-footer">
                    <Link to="/login">Back to User Login</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
