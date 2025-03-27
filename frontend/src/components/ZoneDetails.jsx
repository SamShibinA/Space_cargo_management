import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Button, 
  Paper,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { ThemeContext } from "../App";

// Expanded cargo items list
const cargoItems = [
  { id: "001", name: "Food Packet", width: 10, depth: 10, height: 20, mass: 5, priority: 80, expiry: "2025-05-20", uses: "30 uses", preferredZone: "Crew Quarters" },
  { id: "002", name: "Oxygen Cylinder", width: 15, depth: 15, height: 50, mass: 30, priority: 95, expiry: "N/A", uses: "100 uses", preferredZone: "Airlock" },
  { id: "003", name: "First Aid Kit", width: 20, depth: 20, height: 10, mass: 2, priority: 100, expiry: "2025-07-10", uses: "5 uses", preferredZone: "Medical Bay" },
  { id: "004", name: "Water Container", width: 30, depth: 30, height: 40, mass: 25, priority: 90, expiry: "2024-12-15", uses: "N/A", preferredZone: "Crew Quarters" },
  { id: "005", name: "Spare Parts Kit", width: 25, depth: 25, height: 15, mass: 8, priority: 75, expiry: "N/A", uses: "Various", preferredZone: "Engineering" },
  { id: "006", name: "Scientific Equipment", width: 40, depth: 40, height: 30, mass: 15, priority: 85, expiry: "N/A", uses: "N/A", preferredZone: "Laboratory" },
  { id: "007", name: "Space Suit", width: 25, depth: 25, height: 60, mass: 12, priority: 95, expiry: "N/A", uses: "N/A", preferredZone: "Airlock" },
  { id: "008", name: "Exercise Machine", width: 50, depth: 50, height: 30, mass: 20, priority: 70, expiry: "N/A", uses: "N/A", preferredZone: "Crew Quarters" },
  { id: "009", name: "Communication Device", width: 10, depth: 10, height: 5, mass: 1, priority: 100, expiry: "N/A", uses: "N/A", preferredZone: "Command Center" },
  { id: "010", name: "Waste Container", width: 20, depth: 20, height: 30, mass: 10, priority: 60, expiry: "N/A", uses: "N/A", preferredZone: "Sanitation" },
];

// Expanded storage zones
const storageZones = {
  "Crew Quarters": { id: "contA", width: 200, depth: 150, height: 250 },
  "Airlock": { id: "contB", width: 100, depth: 100, height: 200 },
  "Medical Bay": { id: "contC", width: 150, depth: 150, height: 200 },
  "Laboratory": { id: "contD", width: 250, depth: 200, height: 250 },
  "Engineering": { id: "contE", width: 180, depth: 180, height: 220 },
  "Command Center": { id: "contF", width: 120, depth: 120, height: 180 },
  "Sanitation": { id: "contG", width: 100, depth: 100, height: 150 },
  "Storage Bay 1": { id: "contH", width: 300, depth: 200, height: 300 },
  "Storage Bay 2": { id: "contI", width: 300, depth: 200, height: 300 },
  "Emergency Storage": { id: "contJ", width: 150, depth: 100, height: 150 },
};

// Calculate storage metrics for a zone
const calculateZoneMetrics = (zoneName) => {
  const zone = storageZones[zoneName];
  // Sort items by priority (highest first) before calculating metrics
  const zoneItems = cargoItems
    .filter(item => item.preferredZone === zoneName)
    .sort((a, b) => b.priority - a.priority);
  
  const totalVolume = zone.width * zone.depth * zone.height;
  const usedVolume = zoneItems.reduce((sum, item) => sum + (item.width * item.depth * item.height), 0);
  const availableVolume = totalVolume - usedVolume;
  const utilizationPercentage = (usedVolume / totalVolume) * 100;
  
  return {
    zone,
    totalVolume,
    usedVolume,
    availableVolume,
    utilizationPercentage,
    items: zoneItems.map(item => ({
      ...item,
      volume: item.width * item.depth * item.height,
      percentage: ((item.width * item.depth * item.height) / totalVolume) * 100
    }))
  };
};

const ZoneDetails = () => {
  const { darkMode } = useContext(ThemeContext);
  const { zoneName } = useParams();
  const [optimizedPlan, setOptimizedPlan] = useState([]);
  const [showDetails, setShowDetails] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const {
    zone,
    totalVolume,
    usedVolume,
    availableVolume,
    utilizationPercentage,
    items // Already sorted by priority from calculateZoneMetrics
  } = calculateZoneMetrics(zoneName);

  const optimizeStorage = () => {
    let plan = [];
    let remainingVolume = totalVolume;
    
    // Items are already sorted by priority from calculateZoneMetrics
    items.forEach(item => {
      const itemVolume = item.width * item.depth * item.height;
      if (remainingVolume >= itemVolume) {
        remainingVolume -= itemVolume;
        plan.push({
          item,
          status: 'placed',
          used: itemVolume,
          remaining: remainingVolume
        });
      } else {
        plan.push({
          item,
          status: 'failed',
          required: itemVolume,
          available: remainingVolume
        });
      }
    });

    setOptimizedPlan(plan);
  };

  // Format large numbers for display
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <>
      <CssBaseline />
      <Container sx={{ 
        backgroundColor: darkMode ? '#121212' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
        minHeight: '100vh',
        pt: 4,
        pb: 4,
        px: isMobile ? 2 : 3
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
          mb: 3,
          color: darkMode ? '#ffffff' : '#1976d2',
          fontWeight: 600
        }}>
          {zoneName} Storage Analysis
        </Typography>

        {/* Storage Overview Card */}
        <Paper elevation={3} sx={{ 
          p: isMobile ? 2 : 3, 
          mb: 3,
          backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
        }}>
          <Typography variant="h6" gutterBottom>
            Zone Capacity Overview
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexDirection: isMobile ? 'column' : 'row' }}>
            <Box sx={{ width: '100%', mr: isMobile ? 0 : 2, mb: isMobile ? 2 : 0 }}>
              <LinearProgress 
                variant="determinate" 
                value={utilizationPercentage} 
                sx={{ 
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: darkMode ? '#333333' : '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: utilizationPercentage > 90 ? '#f44336' : 
                                    utilizationPercentage > 70 ? '#ff9800' : '#4caf50'
                  }
                }} 
              />
            </Box>
            <Typography variant="body1" sx={{ minWidth: isMobile ? '100%' : 'auto', textAlign: isMobile ? 'center' : 'left' }}>
              {utilizationPercentage.toFixed(1)}% utilized
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            mb: 2,
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            <Chip 
              label={`Total: ${formatNumber(totalVolume)} cm³`}
              color="primary"
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
            <Chip 
              label={`Used: ${formatNumber(usedVolume)} cm³`}
              color={utilizationPercentage > 90 ? "error" : "primary"}
              size={isMobile ? "small" : "medium"}
            />
            <Chip 
              label={`Available: ${formatNumber(availableVolume)} cm³`}
              color={availableVolume > (totalVolume * 0.3) ? "success" : "warning"}
              size={isMobile ? "small" : "medium"}
            />
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexDirection: isMobile ? 'column' : 'row',
            '& > *': {
              flex: isMobile ? 1 : 'none'
            }
          }}>
            <Button 
              variant="contained" 
              onClick={optimizeStorage}
              sx={{
                bgcolor: darkMode ? '#90caf9' : '#1976d2',
                color: darkMode ? '#121212' : '#ffffff',
                width: isMobile ? '100%' : 'auto'
              }}
              fullWidth={isMobile}
            >
              Optimize Storage
            </Button>
            <Button 
              variant="outlined"
              onClick={() => setShowDetails(!showDetails)}
              sx={{
                color: darkMode ? '#90caf9' : '#1976d2',
                borderColor: darkMode ? '#90caf9' : '#1976d2',
                width: isMobile ? '100%' : 'auto'
              }}
              fullWidth={isMobile}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </Box>
        </Paper>

        {/* Zone Specifications */}
        {showDetails && (
          <Paper elevation={3} sx={{ 
            p: isMobile ? 2 : 3, 
            mb: 3,
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
          }}>
            <Typography variant="h6" gutterBottom>
              Zone Specifications
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
              gap: 2 
            }}>
              <Box>
                <Typography variant="subtitle2">Dimensions</Typography>
                <Typography>{zone.width} × {zone.depth} × {zone.height} cm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Total Capacity</Typography>
                <Typography>{formatNumber(totalVolume)} cm³</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Utilization</Typography>
                <Typography>{formatNumber(usedVolume)} cm³ ({utilizationPercentage.toFixed(1)}%)</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Available</Typography>
                <Typography>{formatNumber(availableVolume)} cm³</Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Cargo Items Table - Already sorted by priority */}
        <Paper elevation={3} sx={{ 
          p: isMobile ? 1 : 3, 
          mb: 3,
          backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
          overflowX: 'auto'
        }}>
          <Typography variant="h6" gutterBottom sx={{ px: isMobile ? 1 : 0 }}>
            Cargo Items (Sorted by Priority) - {items.length} items
          </Typography>
          
          <TableContainer>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell>Priority</TableCell>
                  {!isMobile && <TableCell>Item</TableCell>}
                  {!isMobile && <TableCell align="right">Dimensions (cm)</TableCell>}
                  <TableCell align="right">Volume</TableCell>
                  {!isMobile && <TableCell align="right">Zone %</TableCell>}
                  <TableCell align="right">Mass</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Chip 
                        label={item.priority} 
                        size="small"
                        color={
                          item.priority > 90 ? "error" : 
                          item.priority > 70 ? "warning" : "primary"
                        }
                      />
                    </TableCell>
                    {!isMobile && <TableCell>{item.name}</TableCell>}
                    {!isMobile && (
                      <TableCell align="right">
                        {item.width}×{item.depth}×{item.height}
                      </TableCell>
                    )}
                    <TableCell align="right">{formatNumber(item.volume)} cm³</TableCell>
                    {!isMobile && <TableCell align="right">{item.percentage.toFixed(2)}%</TableCell>}
                    <TableCell align="right">{item.mass} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Optimization Results */}
        {optimizedPlan.length > 0 && (
          <Paper elevation={3} sx={{ 
            p: isMobile ? 1 : 3,
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
            overflowX: 'auto'
          }}>
            <Typography variant="h6" gutterBottom sx={{ px: isMobile ? 1 : 0 }}>
              Optimization Results (Priority Order)
            </Typography>
            
            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    <TableCell>Priority</TableCell>
                    {!isMobile && <TableCell>Item</TableCell>}
                    <TableCell align="right">Volume</TableCell>
                    <TableCell align="center">Status</TableCell>
                    {!isMobile && <TableCell align="right">Space After</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {optimizedPlan.map((plan, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip 
                          label={plan.item.priority} 
                          size="small"
                          color={
                            plan.item.priority > 90 ? "error" : 
                            plan.item.priority > 70 ? "warning" : "primary"
                          }
                        />
                      </TableCell>
                      {!isMobile && <TableCell>{plan.item.name}</TableCell>}
                      <TableCell align="right">
                        {formatNumber(plan.status === 'placed' ? plan.used : plan.required)} cm³
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={plan.status === 'placed' ? 'Placed' : 'Cannot Fit'} 
                          color={plan.status === 'placed' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      {!isMobile && (
                        <TableCell align="right">
                          {plan.status === 'placed' ? (
                            `${formatNumber(plan.remaining)} cm³ remaining`
                          ) : (
                            `Only ${formatNumber(plan.available)} cm³ available`
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default ZoneDetails;