import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Button, 
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress
} from "@mui/material";
import { ThemeContext } from "../App";
import { fetchZoneDetails } from "../api/cargoApi";

const ZoneDetails = () => {
  const { darkMode } = useContext(ThemeContext);
  const { zoneName } = useParams();
  const [zoneData, setZoneData] = useState(null);
  const [items, setItems] = useState([]);
  const [optimizedPlan, setOptimizedPlan] = useState([]);
  const [showDetails, setShowDetails] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const loadData = async () => {
      try {
        const { zone, items } = await fetchZoneDetails(zoneName);
        setZoneData(zone);
        setItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [zoneName]);

  const calculateZoneMetrics = () => {
    if (!zoneData || !items) return null;
    
    const totalVolume = zoneData.width * zoneData.depth * zoneData.height;
    const usedVolume = items.reduce((sum, item) => sum + (item.width * item.depth * item.height), 0);
    const availableVolume = totalVolume - usedVolume;
    const utilizationPercentage = (usedVolume / totalVolume) * 100;
    
    return {
      totalVolume,
      usedVolume,
      availableVolume,
      utilizationPercentage,
      items: items
        .sort((a, b) => b.priority - a.priority)
        .map(item => ({
          ...item,
          volume: item.width * item.depth * item.height,
          percentage: ((item.width * item.depth * item.height) / totalVolume) * 100
        }))
    };
  };

  const optimizeStorage = () => {
    const metrics = calculateZoneMetrics();
    if (!metrics) return;

    let plan = [];
    let remainingVolume = metrics.totalVolume;
    
    metrics.items.forEach(item => {
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

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  if (!zoneData) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="warning">Zone data not found</Alert>
    </Container>
  );

  const metrics = calculateZoneMetrics();
  if (!metrics) return null;

  return (
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: '100%', mr: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={metrics.utilizationPercentage} 
              sx={{ 
                height: 10,
                borderRadius: 5,
                backgroundColor: darkMode ? '#333333' : '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: metrics.utilizationPercentage > 90 ? '#f44336' : 
                                  metrics.utilizationPercentage > 70 ? '#ff9800' : '#4caf50'
                }
              }} 
            />
          </Box>
          <Typography variant="body1">
            {metrics.utilizationPercentage.toFixed(1)}% utilized
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            label={`Total: ${formatNumber(metrics.totalVolume)} cm³`}
            color="primary"
            variant="outlined"
          />
          <Chip 
            label={`Used: ${formatNumber(metrics.usedVolume)} cm³`}
            color={metrics.utilizationPercentage > 90 ? "error" : "primary"}
          />
          <Chip 
            label={`Available: ${formatNumber(metrics.availableVolume)} cm³`}
            color={metrics.availableVolume > (metrics.totalVolume * 0.3) ? "success" : "warning"}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={optimizeStorage}
            sx={{ bgcolor: darkMode ? '#90caf9' : '#1976d2', color: darkMode ? '#121212' : '#ffffff' }}
          >
            Optimize Storage
          </Button>
          <Button 
            variant="outlined"
            onClick={() => setShowDetails(!showDetails)}
            sx={{ color: darkMode ? '#90caf9' : '#1976d2', borderColor: darkMode ? '#90caf9' : '#1976d2' }}
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
          
          <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2">Dimensions</Typography>
              <Typography>{zoneData.width} × {zoneData.depth} × {zoneData.height} cm</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Total Capacity</Typography>
              <Typography>{formatNumber(metrics.totalVolume)} cm³</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Utilization</Typography>
              <Typography>{formatNumber(metrics.usedVolume)} cm³ ({metrics.utilizationPercentage.toFixed(1)}%)</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Available</Typography>
              <Typography>{formatNumber(metrics.availableVolume)} cm³</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Cargo Items Table */}
      <Paper elevation={3} sx={{ 
        p: isMobile ? 1 : 3, 
        mb: 3,
        backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
        overflowX: 'auto'
      }}>
        <Typography variant="h6" gutterBottom sx={{ px: isMobile ? 1 : 0 }}>
          Cargo Items (Sorted by Priority) - {metrics.items.length} items
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
              {metrics.items.map((item) => (
                <TableRow key={item._id}>
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
  );
};

export default ZoneDetails;