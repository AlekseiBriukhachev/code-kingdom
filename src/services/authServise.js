import { API_BASE_URL } from '../utils/constants';

export const authService = {
    async register(username, email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        const data = await response.json();
        this.setToken(data.token);
        return data;
    },

    async login(email, password) {
        const reqBody = JSON.stringify({ email, password });
        console.log('Login request body:', reqBody);
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: reqBody
        });

        console.log('Login response status:', response);

        if (!response.ok) {
            const error = await response;
            throw new Error(error.statusText || 'Login failed');
        }

        const data = await response.json();
        this.setToken(data.token);
        return data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('gameState');
    },

    setToken(token) {
        localStorage.setItem('token', token);
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    getAuthenticated() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};