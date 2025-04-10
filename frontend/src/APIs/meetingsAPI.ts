import axios from 'axios';

export interface Meeting {
    _id: string;
    title: string;
    startTime: string;
    endTime: string;
    participants: string[];
  }

const API_BASE = 'http://localhost:8080/api/meetings';

const API = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to API requests
const getAuthToken = () => localStorage.getItem('token');

API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const meetingAPI = {
  getAll: async (page = 1, limit = 5, filter = '') => {
    console.log('Page sent to API:', page);
    try {
      const response = await API.get(`${API_BASE}`, { params: { page, limit, filter } });
      return response.data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    try {
      const response = await API.get(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      throw error;
    }
  },

  create: async (meeting: Omit<Meeting, '_id'>) => {
    try {
      const response = await API.post(API_BASE, meeting);
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Meeting>) => {
    try {
      const response = await API.put(`${API_BASE}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await API.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  },
};
