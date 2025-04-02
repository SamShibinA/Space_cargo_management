import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const WasteManagement = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWasteItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/items/waste');
      
      if (!response.ok) {
        throw new Error('Failed to fetch expired items');
      }
      
      const data = await response.json();
      setWasteItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/items/waste/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      setWasteItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    
    try {
      // Handle multiple possible date formats
      if (dateStr.includes('-')) {
        // Handle ISO format (YYYY-MM-DD)
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      } else if (dateStr.includes('/')) {
        // Handle existing format (could be DD/MM/YYYY or MM/DD/YYYY)
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          // If first part is > 12, assume it's day (DD/MM/YYYY)
          if (parseInt(parts[0]) > 12) {
            return `${parts[0]}/${parts[1]}/${parts[2]}`; // DD/MM/YYYY
          } else {
            return `${parts[1]}/${parts[0]}/${parts[2]}`; // MM/DD/YYYY → DD/MM/YYYY
          }
        }
      }
      
      // If no known format, return as-is
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{
        fontWeight: 'bold',
        color: 'primary.main',
        mb: 4
      }}>
        Expired Items Management
      </Typography>
      
      {wasteItems.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Item ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Zone</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expiry Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wasteItems.map(item => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.itemId}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.preferredZone}</TableCell>
                  <TableCell>{formatDate(item.expiryDate)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="h6" color="textSecondary">
            No expired items found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default WasteManagement;