 const express = require("express");
const Zone = require("../models/Zone");
const Item = require("../models/Item");
const router = express.Router();

// Improved date handling utility
const isExpired = (expiryDate, referenceDate = new Date()) => {
  if (!expiryDate || expiryDate === "N/A") return false;
  
  try {
    // Handle multiple date formats
    let dateParts;
    if (expiryDate.includes('/')) {
      dateParts = expiryDate.split('/');
    } else if (expiryDate.includes('-')) {
      dateParts = expiryDate.split('-');
    } else {
      return false;
    }

    // Handle different date formats (DD/MM/YYYY or MM/DD/YYYY)
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);
    
    // Create date object (handles both formats by checking reasonable values)
    const expiry = new Date(
      year,
      (month >= 0 && month <= 11) ? month : parseInt(dateParts[0]) - 1,
      (day >= 1 && day <= 31) ? day : parseInt(dateParts[1])
    );
    
    // Reset time components for accurate comparison
    referenceDate.setHours(0, 0, 0, 0);
    return expiry <= referenceDate;
  } catch (error) {
    console.error('Date parsing error:', error);
    return false;
  }
};

router.get('/', async (req, res) => {
  try {
    const daysForward = parseInt(req.query.daysForward) || 0;
    const simulationDate = new Date();
    simulationDate.setDate(simulationDate.getDate() + daysForward);
    simulationDate.setHours(0, 0, 0, 0);

    // Fetch data with error handling
    const [zones, items] = await Promise.all([
      Zone.find().lean(),
      Item.find().lean()
    ]);

    // Process data
    const processedZones = zones.map(zone => {
      const zoneItems = items.filter(item => 
        item.preferredZone && item.preferredZone.toString() === zone._id.toString()
      );

      const expiredItems = zoneItems.filter(item => 
        isExpired(item.expiryDate, simulationDate)
      );
      
      const activeItems = zoneItems.filter(item => 
        !isExpired(item.expiryDate, simulationDate)
      );

      const totalVolume = zone.width * zone.depth * zone.height;
      const usedVolume = activeItems.reduce(
        (sum, item) => sum + (item.width * item.depth * item.height), 
        0
      );

      return {
        ...zone,
        zoneId: zone._id.toString(),
        containerId: zone.containerId,
        zoneName: zone.zoneName,
        dimensions: {
          width: zone.width,
          depth: zone.depth,
          height: zone.height
        },
        totalVolume,
        usedVolume,
        availableVolume: totalVolume - usedVolume,
        utilization: totalVolume > 0 ? 
          Math.round((usedVolume / totalVolume) * 100 * 10) / 10 : 0, // 1 decimal place
        items: zoneItems,
        activeItems,
        activeItemCount: activeItems.length,
        expiredItems,
        expiredItemCount: expiredItems.length,
        lastUpdated: new Date().toISOString(),
        ...(daysForward > 0 && { simulationDate: simulationDate.toISOString() })
      };
    });

    res.status(200).json({ 
      success: true,
      zones: processedZones,
      simulated: daysForward > 0,
      simulationDate: daysForward > 0 ? simulationDate.toISOString() : undefined
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;