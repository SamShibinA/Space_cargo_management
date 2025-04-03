const express = require('express');
const router = express.Router();
const Zone = require('../models/Zone');
const Item = require('../models/Item');

// Enhanced date parsing with validation
const parseExpiryDate = (expiryDate) => {
  if (!expiryDate || expiryDate === "N/A") return null;
  try {
    const [day, month, year] = expiryDate.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error('Date parsing error:', error);
    return null;
  }
};

// Improved expiration check
const isExpired = (expiryDate, referenceDate = new Date()) => {
  const expiry = parseExpiryDate(expiryDate);
  return expiry ? expiry <= referenceDate : false;
};

// Standardized API response with error codes
const apiResponse = (res, status, success, data = null, error = null) => {
  const response = { success, timestamp: new Date().toISOString() };
  if (data) response.data = data;
  if (error) response.error = error;
  return res.status(status).json(response);
};

// GET /api/dashboard/current - Get current dashboard state
router.get('/current', async (req, res) => {
  try {
    // Fetch zones and items in parallel for better performance
    const [zones, allItems] = await Promise.all([
      Zone.find().lean(),
      Item.find().lean()
    ]);

    if (!zones || zones.length === 0) {
      return apiResponse(res, 200, true, { zones: [] });
    }

    // Group items by zone for efficient processing
    const itemsByZone = allItems.reduce((acc, item) => {
      const zoneName = item.preferredZone;
      if (!acc[zoneName]) acc[zoneName] = [];
      acc[zoneName].push(item);
      return acc;
    }, {});

    const currentDate = new Date();
    const processedZones = zones.map(zone => {
      const items = itemsByZone[zone.zoneName] || [];
      const totalVolume = zone.width * zone.depth * zone.height;
      
      const expiredItems = items.filter(item => isExpired(item.expiryDate, currentDate));
      const activeItems = items.filter(item => !isExpired(item.expiryDate, currentDate));
      const usedVolume = activeItems.reduce((sum, item) => sum + (item.width * item.depth * item.height), 0);

      return {
        ...zone,
        zoneId: zone._id.toString(),
        dimensions: {
          width: zone.width,
          depth: zone.depth,
          height: zone.height
        },
        totalVolume,
        usedVolume,
        availableVolume: Math.max(0, totalVolume - usedVolume),
        utilization: totalVolume > 0 ? Math.min(100, (usedVolume / totalVolume) * 100) : 0,
        items: items.map(formatItem),
        activeItems: activeItems.map(formatItem),
        activeItemCount: activeItems.length,
        expiredItems: expiredItems.map(formatItem),
        expiredItemCount: expiredItems.length,
        lastUpdated: currentDate.toISOString()
      };
    });

    return apiResponse(res, 200, true, { zones: processedZones });
  } catch (error) {
    console.error('Dashboard error:', error);
    return apiResponse(res, 500, false, null, {
      code: 'DASHBOARD_FETCH_FAILED',
      message: 'Failed to fetch dashboard data',
      details: error.message
    });
  }
});

// POST /api/dashboard/simulate - Simulate future state
router.post('/simulate', async (req, res) => {
  try {
    const { daysForward = 0 } = req.body;
    const days = parseInt(daysForward);
    
    if (isNaN(days) || days < 0) {
      return apiResponse(res, 400, false, null, {
        code: 'INVALID_INPUT',
        message: 'daysForward must be a positive integer'
      });
    }

    const [zones, allItems] = await Promise.all([
      Zone.find().lean(),
      Item.find().lean()
    ]);

    const simulationDate = new Date();
    simulationDate.setDate(simulationDate.getDate() + days);

    const itemsByZone = allItems.reduce((acc, item) => {
      const zoneName = item.preferredZone;
      if (!acc[zoneName]) acc[zoneName] = [];
      acc[zoneName].push(item);
      return acc;
    }, {});

    const simulatedZones = zones.map(zone => {
      const items = itemsByZone[zone.zoneName] || [];
      const totalVolume = zone.width * zone.depth * zone.height;

      const expiredItems = items.filter(item => isExpired(item.expiryDate, simulationDate));
      const activeItems = items.filter(item => !isExpired(item.expiryDate, simulationDate));
      const usedVolume = activeItems.reduce((sum, item) => sum + (item.width * item.depth * item.height), 0);

      return {
        ...zone,
        zoneId: zone._id.toString(),
        dimensions: {
          width: zone.width,
          depth: zone.depth,
          height: zone.height
        },
        totalVolume,
        usedVolume,
        availableVolume: Math.max(0, totalVolume - usedVolume),
        utilization: totalVolume > 0 ? Math.min(100, (usedVolume / totalVolume) * 100) : 0,
        items: items.map(formatItem),
        activeItems: activeItems.map(formatItem),
        activeItemCount: activeItems.length,
        expiredItems: expiredItems.map(formatItem),
        expiredItemCount: expiredItems.length,
        simulationDate: simulationDate.toISOString(),
        lastUpdated: new Date().toISOString()
      };
    });

    return apiResponse(res, 200, true, { zones: simulatedZones });
  } catch (error) {
    console.error('Simulation error:', error);
    return apiResponse(res, 500, false, null, {
      code: 'SIMULATION_FAILED',
      message: 'Failed to simulate dashboard data',
      details: error.message
    });
  }
});

// GET /api/dashboard/search - Search items
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string' || q.trim() === '') {
      return apiResponse(res, 200, true, { results: [] });
    }

    const searchQuery = q.trim();
    const [items, zones] = await Promise.all([
      Item.find({
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { itemId: { $regex: searchQuery, $options: 'i' } }
        ]
      }).lean(),
      Zone.find().lean()
    ]);

    const zoneMap = zones.reduce((acc, zone) => {
      acc[zone.zoneName] = zone;
      return acc;
    }, {});

    const currentDate = new Date();
    const results = items.map(item => ({
      ...formatItem(item),
      zoneName: item.preferredZone,
      containerId: zoneMap[item.preferredZone]?.containerId || 'N/A',
      isExpired: isExpired(item.expiryDate, currentDate)
    }));

    return apiResponse(res, 200, true, { results });
  } catch (error) {
    console.error('Search error:', error);
    return apiResponse(res, 500, false, null, {
      code: 'SEARCH_FAILED',
      message: 'Failed to perform search',
      details: error.message
    });
  }
});

// Helper function to format item data consistently
function formatItem(item) {
  return {
    _id: item._id.toString(),
    itemId: item.itemId,
    name: item.name,
    width: item.width,
    depth: item.depth,
    height: item.height,
    expiryDate: item.expiryDate,
    volume: item.width * item.depth * item.height,
    preferredZone: item.preferredZone
  };
}

module.exports = router;