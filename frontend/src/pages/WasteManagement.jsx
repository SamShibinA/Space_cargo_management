import React, { useEffect, useState } from 'react';
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
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const WasteManagement = () => {
  const [waste, setWaste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWasteItems = async () => {
      try {
        const response = await axios.get('/api/items/waste');
        setWaste(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to fetch waste items');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/items/waste/${id}`);
      setWaste(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
      console.error('Delete error:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('/');
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Waste Management
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Item ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Expiry Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {waste.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.itemId}</TableCell>
                <TableCell>{item.itemname}</TableCell>
                <TableCell>{formatDate(item.ExpDate)}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleDelete(item.id)}
                    color="error"
                    aria-label="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {waste.length === 0 && !loading && (
        <Typography sx={{ mt: 4, textAlign: 'center' }}>
          No expired items found
        </Typography>
      )}
    </Container>
  );
};

export default WasteManagement;