import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../config/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token) {
            setUser({ token, username: username || '' });
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (username, password) => {
        try {
            const data = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('username', data.username || username);
            setUser({ token: data.accessToken, username: data.username || username, fullName: data.fullName });
            toast.success('Đăng nhập thành công!');
            return true;
        } catch (error) {
            return false;
        }
    }, []);

    const register = useCallback(async (name, username, password) => {
        try {
            const data = await api.post('/auth/register', { fullName: name, username, password });
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('username', data.username || username);
            setUser({ token: data.accessToken, username: data.username || username, fullName: data.fullName || name });
            toast.success('Đăng ký thành công!');
            return true;
        } catch (error) {
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
        toast.success('Đã đăng xuất!');
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
