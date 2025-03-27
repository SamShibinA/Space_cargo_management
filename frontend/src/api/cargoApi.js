import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchZones = async () => {
  try {
    const response = await axios.get(`${API_URL}/zones`);
    return response.data;
  } catch (error) {
    console.error('Error fetching zones:', error);
    throw error;
  }
};

export const fetchItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const fetchZoneDetails = async (zoneName) => {
  try {
    const zones = await fetchZones();
    const zone = zones.find(z => z.zoneName === zoneName);
    if (!zone) throw new Error('Zone not found');
    
    const items = await fetchItems();
    const zoneItems = items.filter(item => item.preferredZone === zoneName);
    
    return {
      zone,
      items: zoneItems
    };
  } catch (error) {
    console.error('Error fetching zone details:', error);
    throw error;
  }
};