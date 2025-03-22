export interface Meeting {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    participants: string[];
  }
  
  const API_BASE = 'http://localhost:8080/api/meetings';
  
  export const meetingAPI = {
    getAll: async (page = 1, limit = 5, filter = ''): Promise<{ meetings: Meeting[]; totalCount: number }> => {
      const response = await fetch(`${API_BASE}?page=${page}&limit=${limit}&filter=${filter}`);
      return response.json();
    },
  
    getOne: async (id: string): Promise<Meeting> => {
      const response = await fetch(`${API_BASE}/${id}`);
      return response.json();
    },
  
    create: async (meeting: Omit<Meeting, 'id'>): Promise<Meeting> => {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meeting),
      });
      return response.json();
    },
  
    update: async (id: string, updates: Partial<Meeting>): Promise<Meeting> => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return response.json();
    },
  
    delete: async (id: string): Promise<void> => {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    },
  };