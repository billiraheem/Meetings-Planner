import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  // console.log("Token being sent:", token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.errorMessage === 'Token expired, please log in again') {
      console.log('Token expired detected');
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('accessToken'); // Clear expired token
      window.location.href = '/'; // Redirect to homepage
    }
    return Promise.reject(error); // Pass other errors through
  }
);

// Auth API calls
export const authAPI = {
  signup: async (userData: { name: string; email: string; password: string; confirmPassword: string }) => {
    return api.post('/auth/signup', userData);
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('isAdmin', response.data.isAdmin);
    }
    return response;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAdmin');
    return response;
  },
  
  refreshToken: async () => {
    return api.post('/auth/refresh');
  },
};

// Meeting API calls
export const meetingAPI = {
  getMeetings: async (page?: number, limit?: number, filter = '') => { //1, 10
    return api.get(`/meetings?page=${page}&limit=${limit}&filter=${filter}`);
  },
  
  getMeeting: async (id: string) => {
    return api.get(`/meetings/${id}`);
  },
  
  createMeeting: async (meetingData: {
    title: string;
    startTime: Date;
    endTime: Date;
    participants: string[];
  }) => {
    return api.post('/meetings', meetingData);
  },
  
  updateMeeting: async (id: string, meetingData: {
    title?: string;
    startTime?: Date;
    endTime?: Date;
    participants?: string[];
  }) => {
    return api.put(`/meetings/${id}`, meetingData);
  },
  
  deleteMeeting: async (id: string) => {
    return api.delete(`/meetings/${id}`);
  },
};

// export const login = (data: { email: string; password: string }) =>
//   api.post('/auth/login', data);

// export const signup = (data: { name: string; email: string; password: string; confirmPassword: string }) =>
//   api.post('/auth/signup', data);

// export const getMeetings = (page: number, limit: number) =>
//   api.get(`/meetings?page=${page}&limit=${limit}`);

// export const getMeeting = (id: string) => api.get(`/meetings/${id}`);

// export const createMeeting = (data: any) => api.post('/meetings', data);

// export const updateMeeting = (id: string, data: any) => api.put(`/meetings/${id}`, data);

// export const deleteMeeting = (id: string) => api.delete(`/meetings/${id}`);