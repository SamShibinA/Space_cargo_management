// import React, { useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { 
//   Container, 
//   Typography, 
//   Button, 
//   Paper,
//   Box,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   CssBaseline,
//   LinearProgress,
//   Chip
// } from "@mui/material";
// import { ThemeContext } from "../App";

// const cargoItems = [
//   { id: "001", name: "Food Packet", width: 10, depth: 10, height: 20, mass: 5, priority: 80, expiry: "2025-05-20", uses: "30 uses", preferredZone: "Crew Quarters" },
//   { id: "002", name: "Oxygen Cylinder", width: 15, depth: 15, height: 50, mass: 30, priority: 95, expiry: "N/A", uses: "100 uses", preferredZone: "Airlock" },
//   { id: "003", name: "First Aid Kit", width: 20, depth: 20, height: 10, mass: 2, priority: 100, expiry: "2025-07-10", uses: "5 uses", preferredZone: "Medical Bay" },
// ];

// // Initialize storage zones without usedSpace (we'll calculate it dynamically)
// const storageZones = {
//   "Crew Quarters": { id: "contA", width: 100, depth: 85, height: 200 },
//   "Airlock": { id: "contB", width: 50, depth: 85, height: 200 },
//   "Laboratory": { id: "contC", width: 200, depth: 85, height: 200 },
// };

// // Calculate used space for a zone
// const calculateUsedSpace = (zoneName) => {
//   const zoneItems = cargoItems.filter(item => item.preferredZone === zoneName);
//   return zoneItems.reduce((total, item) => {
//     return total + (item.width * item.depth * item.height);
//   }, 0);
// };

// // Calculate total volume of a zone
// const calculateTotalVolume = (zone) => {
//   return zone.width * zone.depth * zone.height;
// };

// const DocumentField = ({ label, value, darkMode }) => (
//   <Box sx={{ display: 'flex', mb: 1 }}>
//     <Typography variant="body2" sx={{ 
//       minWidth: 120, 
//       fontWeight: 'bold',
//       color: darkMode ? '#ffffff' : '#333333'
//     }}>
//       {label}:
//     </Typography>
//     <Typography variant="body2" sx={{ color: darkMode ? '#bbbbbb' : '#555555' }}>
//       {typeof value === 'object' ? JSON.stringify(value) : value}
//     </Typography>
//   </Box>
// );

// const ZoneDetails = () => {
//   const { darkMode } = useContext(ThemeContext);
//   const { zoneName } = useParams();
//   const [optimizedPlan, setOptimizedPlan] = useState([]);
//   const [showDocuments, setShowDocuments] = useState(false);

//   const currentZone = storageZones[zoneName];
//   const usedSpace = calculateUsedSpace(zoneName);
//   const totalVolume = calculateTotalVolume(currentZone);
//   const availableSpace = totalVolume - usedSpace;
//   const utilizationPercentage = (usedSpace / totalVolume) * 100;

//   const optimizeStorageForZone = () => {
//     let plan = [];
//     let remainingSpace = totalVolume;
    
//     const sortedItems = [...cargoItems]
//       .filter(item => item.preferredZone === zoneName)
//       .sort((a, b) => b.priority - a.priority);

//     sortedItems.forEach((item) => {
//       const itemVolume = item.width * item.depth * item.height;
//       if (remainingSpace >= itemVolume) {
//         remainingSpace -= itemVolume;
//         plan.push(`${item.name} placed (Used ${itemVolume} cm³, Remaining ${remainingSpace} cm³)`);
//       } else {
//         plan.push(`${item.name} cannot fit (Needs ${itemVolume} cm³, Available ${remainingSpace} cm³)`);
//       }
//     });

//     setOptimizedPlan(plan);
//   };

//   const itemsForZone = cargoItems.filter(item => item.preferredZone === zoneName);

//   return (
//     <>
//       <CssBaseline />
//       <Container sx={{ 
//         backgroundColor: darkMode ? '#121212' : '#ffffff',
//         color: darkMode ? '#ffffff' : '#000000',
//         minHeight: '100vh',
//         pt: 8
//       }}>
//         <Typography variant="h4" sx={{ 
//           mb: 3,
//           color: darkMode ? '#ffffff' : '#1976d2'
//         }}>
//           {zoneName} Storage Analysis
//         </Typography>

//         {/* Space Utilization Summary */}
//         <Paper elevation={3} sx={{ 
//           p: 3, 
//           mb: 3,
//           backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
//         }}>
//           <Typography variant="h6" gutterBottom>
//             Space Utilization
//           </Typography>
          
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//             <Box sx={{ width: '100%', mr: 2 }}>
//               <LinearProgress 
//                 variant="determinate" 
//                 value={utilizationPercentage} 
//                 sx={{ 
//                   height: 10,
//                   borderRadius: 5,
//                   backgroundColor: darkMode ? '#333333' : '#e0e0e0',
//                   '& .MuiLinearProgress-bar': {
//                     backgroundColor: utilizationPercentage > 90 ? '#f44336' : 
//                                     utilizationPercentage > 70 ? '#ff9800' : '#4caf50'
//                   }
//                 }} 
//               />
//             </Box>
//             <Typography>
//               {utilizationPercentage.toFixed(1)}% utilized
//             </Typography>
//           </Box>

//           <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//             <Chip 
//               label={`Total: ${totalVolume} cm³`}
//               variant="outlined"
//               color="primary"
//             />
//             <Chip 
//               label={`Used: ${usedSpace} cm³`}
//               color={utilizationPercentage > 90 ? "error" : "primary"}
//             />
//             <Chip 
//               label={`Available: ${availableSpace} cm³`}
//               color={availableSpace > (totalVolume * 0.3) ? "success" : "warning"}
//             />
//           </Box>
//         </Paper>

//         <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={optimizeStorageForZone}
//             sx={{
//               bgcolor: darkMode ? '#90caf9' : '#1976d2',
//               color: darkMode ? '#121212' : '#ffffff'
//             }}
//           >
//             Optimize Storage
//           </Button>
//           <Button 
//             variant="outlined" 
//             onClick={() => setShowDocuments(!showDocuments)}
//             sx={{
//               color: darkMode ? '#90caf9' : '#1976d2',
//               borderColor: darkMode ? '#90caf9' : '#1976d2'
//             }}
//           >
//             {showDocuments ? 'Hide Details' : 'Show Details'}
//           </Button>
//         </Box>

//         {showDocuments && (
//           <Paper elevation={3} sx={{ 
//             p: 3, 
//             mb: 3,
//             backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
//           }}>
//             <Typography variant="h6" gutterBottom>
//               Zone Specifications
//             </Typography>
//             <DocumentField label="Zone ID" value={currentZone.id} darkMode={darkMode} />
//             <DocumentField label="Dimensions" value={`${currentZone.width} × ${currentZone.depth} × ${currentZone.height} cm`} darkMode={darkMode} />
//             <DocumentField label="Total Volume" value={`${totalVolume} cm³`} darkMode={darkMode} />
//             <DocumentField label="Used Space" value={`${usedSpace} cm³ (${utilizationPercentage.toFixed(1)}%)`} darkMode={darkMode} />
//             <DocumentField label="Available Space" value={`${availableSpace} cm³`} darkMode={darkMode} />
            
//             <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
//               Contained Items ({itemsForZone.length})
//             </Typography>
//             {itemsForZone.length > 0 ? (
//               <List>
//                 {itemsForZone.map((item) => {
//                   const itemVolume = item.width * item.depth * item.height;
//                   const itemPercentage = (itemVolume / totalVolume) * 100;
                  
//                   return (
//                     <ListItem key={item.id} divider>
//                       <ListItemText
//                         primary={item.name}
//                         secondary={
//                           <>
//                             <span>Volume: {itemVolume} cm³ ({itemPercentage.toFixed(1)}% of zone)</span><br />
//                             <span>Priority: {item.priority}</span>
//                           </>
//                         }
//                         secondaryTypographyProps={{
//                           color: darkMode ? '#bbbbbb' : '#555555'
//                         }}
//                       />
//                     </ListItem>
//                   );
//                 })}
//               </List>
//             ) : (
//               <Typography>No items assigned to this zone</Typography>
//             )}
//           </Paper>
//         )}

//         {optimizedPlan.length > 0 && (
//           <Paper elevation={3} sx={{ 
//             p: 3,
//             backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
//           }}>
//             <Typography variant="h6" gutterBottom>
//               Optimization Results
//             </Typography>
//             <List>
//               {optimizedPlan.map((step, index) => (
//                 <ListItem key={index} divider>
//                   <ListItemText 
//                     primary={step} 
//                     primaryTypographyProps={{ 
//                       color: step.includes('cannot fit') ? 'error' : 'success.main',
//                       fontFamily: 'monospace'
//                     }} 
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </Paper>
//         )}
//       </Container>
//     </>
//   );
// };

// export default ZoneDetails;
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
  TableRow
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
  const zoneItems = cargoItems.filter(item => item.preferredZone === zoneName);
  
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

  const {
    zone,
    totalVolume,
    usedVolume,
    availableVolume,
    utilizationPercentage,
    items
  } = calculateZoneMetrics(zoneName);

  const optimizeStorage = () => {
    let plan = [];
    let remainingVolume = totalVolume;
    
    // Sort by priority (highest first) then by volume (smallest first)
    const sortedItems = [...items].sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return (a.width * a.depth * a.height) - (b.width * b.depth * b.height);
    });

    sortedItems.forEach(item => {
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

  return (
    <>
      <CssBaseline />
      <Container sx={{ 
        backgroundColor: darkMode ? '#121212' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
        minHeight: '100vh',
        pt: 8
      }}>
        <Typography variant="h4" sx={{ 
          mb: 3,
          color: darkMode ? '#ffffff' : '#1976d2'
        }}>
          {zoneName} Storage Analysis
        </Typography>

        {/* Storage Overview Card */}
        <Paper elevation={3} sx={{ 
          p: 3, 
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
            <Typography variant="body1">
              {utilizationPercentage.toFixed(1)}% utilized
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Chip 
              label={`Total Volume: ${totalVolume} cm³`}
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={`Used Space: ${usedVolume} cm³`}
              color={utilizationPercentage > 90 ? "error" : "primary"}
            />
            <Chip 
              label={`Available Space: ${availableVolume} cm³`}
              color={availableVolume > (totalVolume * 0.3) ? "success" : "warning"}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={optimizeStorage}
              sx={{
                bgcolor: darkMode ? '#90caf9' : '#1976d2',
                color: darkMode ? '#121212' : '#ffffff'
              }}
            >
              Optimize Storage
            </Button>
            <Button 
              variant="outlined"
              onClick={() => setShowDetails(!showDetails)}
              sx={{
                color: darkMode ? '#90caf9' : '#1976d2',
                borderColor: darkMode ? '#90caf9' : '#1976d2'
              }}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </Box>
        </Paper>

        {/* Zone Specifications */}
        {showDetails && (
          <Paper elevation={3} sx={{ 
            p: 3, 
            mb: 3,
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
          }}>
            <Typography variant="h6" gutterBottom>
              Zone Specifications
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2">Dimensions</Typography>
                <Typography>{zone.width} × {zone.depth} × {zone.height} cm</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Total Capacity</Typography>
                <Typography>{totalVolume} cm³</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Utilization</Typography>
                <Typography>{usedVolume} cm³ ({utilizationPercentage.toFixed(1)}%)</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Available</Typography>
                <Typography>{availableVolume} cm³</Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Cargo Items Table */}
        <Paper elevation={3} sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
        }}>
          <Typography variant="h6" gutterBottom>
            Cargo Items ({items.length})
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Dimensions (cm)</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell align="right">Zone %</TableCell>
                  <TableCell align="right">Priority</TableCell>
                  <TableCell align="right">Mass</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.width}×{item.depth}×{item.height}</TableCell>
                    <TableCell align="right">{item.volume} cm³</TableCell>
                    <TableCell align="right">{item.percentage.toFixed(2)}%</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={item.priority} 
                        size="small"
                        color={
                          item.priority > 90 ? "error" : 
                          item.priority > 70 ? "warning" : "primary"
                        }
                      />
                    </TableCell>
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
            p: 3,
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5'
          }}>
            <Typography variant="h6" gutterBottom>
              Optimization Results
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Volume</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="right">Space After</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {optimizedPlan.map((plan, index) => (
                    <TableRow key={index}>
                      <TableCell>{plan.item.name}</TableCell>
                      <TableCell align="right">
                        {plan.status === 'placed' ? plan.used : plan.required} cm³
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={plan.status === 'placed' ? 'Placed' : 'Cannot Fit'} 
                          color={plan.status === 'placed' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {plan.status === 'placed' ? (
                          `${plan.remaining} cm³ remaining`
                        ) : (
                          `Only ${plan.available} cm³ available`
                        )}
                      </TableCell>
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