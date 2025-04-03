import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/dashboard';


export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${API_URL}/current`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Failed to fetch dashboard data');
  } catch (error) {
    console.error('Dashboard API error:', error);
    throw error;
  }
};

export const simulateDashboardData = async (daysForward) => {
  try {
    const response = await axios.post(`${API_URL}/simulate`, { daysForward });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Simulation failed');
  } catch (error) {
    console.error('Simulation API error:', error);
    throw error;
  }
};

export const searchItems = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { q: query }
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Search failed');
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
};