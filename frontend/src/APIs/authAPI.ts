import axios from 'axios';

export interface User {
    _id?: string;
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    // isAdmin?: boolean
}

const API_BASE = 'http://localhost:8080/api';

const API = axios.create({
    baseURL: API_BASE,
    headers: {
      'Content-Type': 'application/json',
    },
});

// Helper function to get token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Attach token to API requests
API.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const authAPI = {
    signup: async (user: Omit<User, '_id'>) => {
        try {
            if (user.password !== user.confirmPassword) {
                throw new Error("Passwords do not match");
            }
            const response = await API.post('/auth/signup', user);
            return response.data;
        } catch(error) {
            console.error("Error registering user:", error);
            throw error;
        }
    },

    login: async ({email, password}:User) => {
        try {
            const response = await API.post('/auth/login', {email, password});
            return response.data;
        } catch(error) {
            console.error("Error logging in user:", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch(error) {
            console.error("Error logging out user:", error);
            throw error;
        }
    }
}

export default authAPI