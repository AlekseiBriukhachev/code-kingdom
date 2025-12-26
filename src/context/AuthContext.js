import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authServise";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = authService.getToken();
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        console.log('AuthProvider login called with:', { username, password });
        const data = await authService.login(username, password);
        const userData = {
            username: data.username,
            email: data.email,
            role: data.role
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return data;
    };

    const register = async (username, email, password) => {
        const data = await authService.register(username, email, password);
        const userData = {
            username: data.username,
            email: data.email,
            role: data.role
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};