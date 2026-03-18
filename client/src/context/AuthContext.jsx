import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    // Track how the user logged in: 'user' | 'admin' | null
    const [loginMode, setLoginMode] = useState(() => {
        return sessionStorage.getItem('sn_login_mode') || null;
    });

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (!error && data) {
                setProfile(data);
            }
            return data;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                setLoginMode(null);
                sessionStorage.removeItem('sn_login_mode');
            } else if (session?.user) {
                setUser(session.user);
                await fetchProfile(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const prof = await fetchProfile(data.user.id);
        // If user has admin role, they should use admin login
        if (prof?.role === 'admin') {
            await supabase.auth.signOut();
            throw new Error('Please use the Admin Login page to access the admin portal.');
        }
        setLoginMode('user');
        sessionStorage.setItem('sn_login_mode', 'user');
        return { user: data.user, profile: prof };
    };

    const adminLogin = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const prof = await fetchProfile(data.user.id);
        if (!prof || prof.role !== 'admin') {
            await supabase.auth.signOut();
            throw new Error('Invalid admin credentials. Only admin accounts can access the dashboard.');
        }
        setLoginMode('admin');
        sessionStorage.setItem('sn_login_mode', 'admin');
        return { user: data.user, profile: prof };
    };

    const signup = async ({ name, email, password, phone }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, phone, role: 'user' }
            }
        });
        if (error) {
            if (error.message?.toLowerCase().includes('rate limit')) {
                throw new Error('Too many signup attempts. Please wait a few minutes and try again.');
            }
            throw error;
        }

        // Supabase returns a fake user with empty identities when email already exists
        // This is a "repeated signup" — the account was NOT actually created
        if (data?.user?.identities?.length === 0) {
            throw new Error('An account with this email already exists. Please sign in instead.');
        }

        // Check if email confirmation is needed (user exists but not confirmed)
        if (data?.user && !data?.session) {
            // User created but needs email confirmation
            return data;
        }

        // Auto-login as user after signup (if auto-confirmed)
        if (data?.user && data?.session) {
            setLoginMode('user');
            sessionStorage.setItem('sn_login_mode', 'user');
        }
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setLoginMode(null);
        sessionStorage.removeItem('sn_login_mode');
    };

    const isAdmin = profile?.role === 'admin';
    // User is logged in as a "user" only if they used user login or are a regular user
    const isUserLoggedIn = !!user && loginMode === 'user' && !isAdmin;
    // Admin is actively in admin mode
    const isAdminLoggedIn = !!user && isAdmin && loginMode === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            login,
            adminLogin,
            signup,
            logout,
            isAdmin,
            isUserLoggedIn,
            isAdminLoggedIn,
            loginMode
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
