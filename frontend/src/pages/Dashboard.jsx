import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, Grid, Typography, Button, TextField, Paper, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Divider, CircularProgress,
  Alert, useTheme, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ThemeContext } from '../App';
import ZoneProgress from '../components/ZoneProgress';

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const [state, setState] = useState({
    zones: [],
    selectedZone: null,
    daysForward: 0,
    isSimulating: false,
    isLoading: true,
    error: null,
    searchQuery: '',
    searchResults: []
  });

  // Dummy data - replace with your actual data fetching
  const baseData = {
    zones: [
      {
        _id: '1',
        zoneId: '1',
        zoneName: 'Main Storage',
        containerId: 'STG-001',
        dimensions: { width: 200, depth: 150, height: 250 },
        totalVolume: 200 * 150 * 250,
        items: [
          { _id: '101', itemId: 'ITM-101', name: 'Oxygen Tank', width: 30, depth: 30, height: 60, expiryDate: '15/06/2023' },
          { _id: '102', itemId: 'ITM-102', name: 'Food Package', width: 20, depth: 20, height: 10, expiryDate: '30/09/2023' },
          { _id: '103', itemId: 'ITM-103', name: 'Tool Kit', width: 40, depth: 20, height: 15, expiryDate: 'N/A' }
        ]
      },
      {
        _id: '2',
        zoneId: '2',
        zoneName: 'Cold Storage',
        containerId: 'STG-002',
        dimensions: { width: 150, depth: 100, height: 200 },
        totalVolume: 150 * 100 * 200,
        items: [
          { _id: '201', itemId: 'ITM-201', name: 'Vaccine A', width: 100, depth: 100, height: 15, expiryDate: '01/07/2026' },
          { _id: '202', itemId: 'ITM-202', name: 'Vaccine B', width: 10, depth: 10, height: 15, expiryDate: '15/08/2025' }
        ]
      }
    ]
  };

  const isExpired = (expiryDate, referenceDate = new Date()) => {
    if (!expiryDate || expiryDate === "N/A") return false;
    try {
      const [day, month, year] = expiryDate.split('/');
      const expiry = new Date(`${year}-${month}-${day}`);
      return expiry <= referenceDate;
    } catch (error) {
      console.error('Date parsing error:', error);
      return false;
    }
  };

  const processZoneData = (zones, daysForward = 0) => {
    const simulationDate = new Date();
    simulationDate.setDate(simulationDate.getDate() + daysForward);

    return zones.map(zone => {
      const expiredItems = zone.items.filter(item => isExpired(item.expiryDate, simulationDate));
      const activeItems = zone.items.filter(item => !isExpired(item.expiryDate, simulationDate));
      const usedVolume = activeItems.reduce((sum, item) => sum + (item.width * item.depth * item.height), 0);
      
      return {
        ...zone,
        usedVolume,
        availableVolume: zone.totalVolume - usedVolume,
        utilization: zone.totalVolume > 0 ? (usedVolume / zone.totalVolume) * 100 : 0,
        activeItems,
        activeItemCount: activeItems.length,
        expiredItems,
        expiredItemCount: expiredItems.length,
        lastUpdated: new Date().toISOString(),
        ...(daysForward > 0 && { simulationDate: simulationDate.toISOString() })
      };
    });
  };

  const loadData = (daysForward = 0) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call delay
      setTimeout(() => {
        const processedZones = processZoneData(baseData.zones, daysForward);
        
        setState(prev => ({
          ...prev,
          zones: processedZones,
          selectedZone: processedZones.find(z => z.zoneId === prev.selectedZone?.zoneId) || processedZones[0],
          isLoading: false,
          isSimulating: daysForward > 0,
          searchResults: [] // Clear search results on new simulation
        }));
      }, 500);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (query) => {
    setState(prev => ({ ...prev, searchQuery: query }));
    
    if (query.trim() === '') {
      setState(prev => ({ ...prev, searchResults: [] }));
      return;
    }

    const results = [];
    state.zones.forEach(zone => {
      zone.items.forEach(item => {
        if (item.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            ...item,
            zoneName: zone.zoneName,
            isExpired: isExpired(item.expiryDate, state.isSimulating ? new Date(zone.simulationDate) : new Date())
          });
        }
      });
    });

    setState(prev => ({ ...prev, searchResults: results }));
  };

  const handleSimulate = () => {
    if (state.daysForward > 0) {
      loadData(state.daysForward);
    }
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, daysForward: 0 }));
    loadData();
  };

  const { 
    zones, 
    selectedZone, 
    daysForward, 
    isSimulating, 
    isLoading, 
    error,
    searchQuery,
    searchResults
  } = state;
  const isMobile = useTheme().breakpoints.down('sm');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => loadData()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Storage Dashboard {isSimulating && `(Simulation: +${daysForward} days)`}
      </Typography>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
        <TextField
          label="Days to simulate"
          type="number"
          value={daysForward}
          onChange={(e) => {
            const value = Math.max(0, parseInt(e.target.value) || 0);
            setState(prev => ({ ...prev, daysForward: value }));
          }}
          sx={{ width: isMobile ? '100%' : 150 }}
          inputProps={{ min: 0 }}
        />
        <Button
          variant="contained"
          onClick={handleSimulate}
          disabled={daysForward <= 0 || isLoading}
          sx={{ width: isMobile ? '100%' : 'auto' }}
        >
          Simulate
        </Button>
        {isSimulating && (
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ ml: 'auto', width: isMobile ? '100%' : 'auto' }}
          >
            Reset
          </Button>
        )}
      </Paper>
      
      {zones.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No storage zones found</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Zones List */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Storage Zones
              </Typography>
              {zones.map(zone => (
                <ZoneProgress
                  key={zone.zoneId}
                  zone={zone}
                  onClick={(zone) => setState(prev => ({ ...prev, selectedZone: zone }))}
                  isActive={selectedZone?.zoneId === zone.zoneId}
                />
              ))}
            </Paper>
          </Grid>

          {/* Search Column */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Item Search
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              {searchResults.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Zone</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchResults.slice(0, 5).map(item => (
                        <TableRow key={item._id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.zoneName}</TableCell>
                          <TableCell align="right">
                            {item.isExpired ? (
                              <span style={{ color: 'red' }}>Expired</span>
                            ) : (
                              <span style={{ color: 'green' }}>Active</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {searchQuery ? 'No items found' : 'Enter search terms to find items'}
                </Typography>
              )}

              {isSimulating && selectedZone?.simulationDate && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Simulation Date: {new Date(selectedZone.simulationDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Items Column */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {/* Active Items */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Active Items ({selectedZone?.activeItemCount || 0})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Size</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedZone?.activeItems?.slice(0, 5).map(item => (
                          <TableRow key={item._id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">
                              {item.width}x{item.depth}x{item.height}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Expired Items */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" color="error.main" gutterBottom>
                    Expired Items ({selectedZone?.expiredItemCount || 0})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Expired</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedZone?.expiredItems?.slice(0, 5).map(item => (
                          <TableRow key={item._id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">
                              {item.expiryDate}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;