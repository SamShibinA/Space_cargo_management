import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Improved date validation and parsing
const parseExpiryDate = (expiryDate, referenceDate) => {
  if (!expiryDate || expiryDate === "N/A") return false;
  
  try {
    // Handle multiple date formats
    const dateParts = expiryDate.includes('/') 
      ? expiryDate.split('/') 
      : expiryDate.split('-');
    
    if (dateParts.length !== 3) return false;

    // Try DD/MM/YYYY format first
    let day = parseInt(dateParts[0]);
    let month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);

    // Validate date components
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (month < 0 || month > 11) {
      // Try MM/DD/YYYY format if month is invalid
      month = parseInt(dateParts[0]) - 1;
      day = parseInt(dateParts[1]);
      if (month < 0 || month > 11) return false;
    }

    const expiry = new Date(year, month, day);
    if (isNaN(expiry.getTime())) return false;

    return expiry <= referenceDate;
  } catch (error) {
    console.error('Date parsing error:', error);
    return false;
  }
};

export const fetchDashboardData = async (daysForward = 0) => {
  try {
    const [zonesResponse, itemsResponse] = await Promise.all([
      api.get('/zones'),
      api.get('/items')
    ]);

    // Validate responses
    if (!zonesResponse.data || !itemsResponse.data) {
      throw new Error('Invalid data structure from server');
    }

    const simulationDate = new Date();
    simulationDate.setDate(simulationDate.getDate() + daysForward);
    simulationDate.setHours(0, 0, 0, 0);

    const processedZones = zonesResponse.data.map(zone => {
      // Safely access dimensions with defaults
      const dimensions = zone.dimensions || { width: 0, depth: 0, height: 0 };
      const totalVolume = dimensions.width * dimensions.depth * dimensions.height;

      // Match items to zone using both zoneName and _id for reliability
      const zoneItems = itemsResponse.data.filter(item => 
        item.preferredZone && (
          item.preferredZone === zone.zoneName || 
          item.preferredZone.toString() === zone._id?.toString()
        )
      );

      // Process items with safe property access
      const expiredItems = zoneItems.filter(item => 
        parseExpiryDate(item.expiryDate, simulationDate)
      );
      
      const activeItems = zoneItems.filter(item => 
        !parseExpiryDate(item.expiryDate, simulationDate)
      );

      const usedVolume = activeItems.reduce((sum, item) => {
        const itemVolume = (item.width || 0) * (item.depth || 0) * (item.height || 0);
        return sum + itemVolume;
      }, 0);

      return {
        ...zone,
        zoneId: zone._id?.toString() || zone.zoneId,
        containerId: zone.containerId,
        zoneName: zone.zoneName,
        dimensions,
        totalVolume,
        usedVolume,
        availableVolume: Math.max(0, totalVolume - usedVolume),
        utilization: totalVolume > 0 
          ? Math.round((usedVolume / totalVolume) * 100 * 10) / 10 
          : 0,
        items: zoneItems,
        activeItems,
        activeItemCount: activeItems.length,
        expiredItems,
        expiredItemCount: expiredItems.length,
        lastUpdated: new Date().toISOString(),
        ...(daysForward > 0 && { simulationDate: simulationDate.toISOString() })
      };
    });

    return { 
      success: true,
      zones: processedZones,
      simulated: daysForward > 0,
      simulationDate: daysForward > 0 ? simulationDate.toISOString() : undefined
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch dashboard data',
      status: error.response?.status || 500
    };
  }
};