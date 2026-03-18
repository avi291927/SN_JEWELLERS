import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageEnquiries from './pages/admin/ManageEnquiries';
import ManageFeedback from './pages/admin/ManageFeedback';

import { useEffect } from 'react';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

// Protect admin routes — redirects to admin login if not authenticated as admin
const AdminRoute = ({ children }) => {
    const { isAdminLoggedIn, loading } = useAuth();
    if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
    if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />;
    return children;
};

// Protect user-only routes — redirects to login if not authenticated
const UserRoute = ({ children }) => {
    const { isUserLoggedIn, loading } = useAuth();
    if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
    if (!isUserLoggedIn) return <Navigate to="/login" replace />;
    return children;
};

const AppLayout = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup', '/admin/login'].includes(location.pathname);
    const isAdminPage = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

    return (
        <>
            <ScrollToTop />
            {!isAuthPage && <Header />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/collections/:category" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
                <Route path="/admin/enquiries" element={<AdminRoute><ManageEnquiries /></AdminRoute>} />
                <Route path="/admin/feedback" element={<AdminRoute><ManageFeedback /></AdminRoute>} />
            </Routes>
            {!isAuthPage && !isAdminPage && <Footer />}
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        </Router>
    );
};

export default App;
