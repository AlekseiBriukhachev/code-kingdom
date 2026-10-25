import { authResponse } from './responses';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authServiceMock = {
    async register(username, email, password) {

        console.log("Mocked registering user:", username, email);
        await delay(300); // simulate network delay
        return authResponse;
    },

    async login(email, password) {
        console.log("Mocked registering user:", email);
        await delay(300); // simulate network delay
        return authResponse;
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
        return 'token1234Mocked';
    },

    isAuthenticated() {
        return 'token1234Mocked';
    },

    getAuthenticated() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer token1234Mocked';` } : {};
    }
};