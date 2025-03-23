import axios from 'axios';

export interface Meeting {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    participants: string[];
  }

const API_BASE = 'http://localhost:8080/api/meetings';

export const meetingAPI = {
  getAll: async (page = 1, limit = 5, filter = '') => {
    try {
      const response = await axios.get(`${API_BASE}`, { params: { page, limit, filter } });
      return response.data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      throw error;
    }
  },

  create: async (meeting: Omit<Meeting, 'id'>) => {
    try {
      const response = await axios.post(API_BASE, meeting);
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },

  update: async (id: string, updates: Partial<Meeting>) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating meeting:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  },
};





  
//   const API_BASE = 'http://localhost:8080/api/meetings';
  
//   export const meetingAPI = {
//     getAll: async (page = 1, limit = 5, filter = ''): Promise<{ meetings: Meeting[]; totalCount: number }> => {
//       const response = await fetch(`${API_BASE}?page=${page}&limit=${limit}&filter=${filter}`);
//       return response.json();
//     },
  
//     getOne: async (id: string): Promise<Meeting> => {
//       const response = await fetch(`${API_BASE}/${id}`);
//       return response.json();
//     },
  
//     create: async (meeting: Omit<Meeting, 'id'>): Promise<Meeting> => {
//       const response = await fetch(API_BASE, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(meeting),
//       });
//       return response.json();
//     },
  
//     update: async (id: string, updates: Partial<Meeting>): Promise<Meeting> => {
//       const response = await fetch(`${API_BASE}/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updates),
//       });
//       return response.json();
//     },
  
//     delete: async (id: string): Promise<void> => {
//       await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
//     },
//   };