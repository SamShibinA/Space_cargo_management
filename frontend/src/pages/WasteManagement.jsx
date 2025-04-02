import React, { useState, useEffect, useContext } from 'react';
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
  Box,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ThemeContext } from '../App';

const WasteManagement = () => {
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const theme = useTheme();
  const { darkMode } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/items/waste/${itemToDelete.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      setWasteItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError(err.message);
      setDeleteConfirmOpen(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    
    try {
      if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      } else if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          if (parseInt(parts[0]) > 12) {
            return `${parts[0]}/${parts[1]}/${parts[2]}`;
          } else {
            return `${parts[1]}/${parts[0]}/${parts[2]}`;
          }
        }
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const renderDesktopTable = () => (
    <TableContainer 
      component={Paper} 
      sx={{ 
        mt: 2, 
        boxShadow: 3,
        bgcolor: darkMode ? 'background.paper' : 'background.default'
      }}
    >
      <Table>
        <TableHead sx={{ bgcolor: darkMode ? 'primary.dark' : 'primary.main' }}>
          <TableRow>
            {['Item ID', 'Name', 'Zone', 'Expiry Date', 'Action'].map((header) => (
              <TableCell 
                key={header}
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {wasteItems.map(item => (
            <TableRow 
              key={item.id} 
              hover
              sx={{
                bgcolor: darkMode ? 'background.default' : 'background.paper',
                '&:hover': {
                  bgcolor: darkMode ? 'action.hover' : 'action.hover'
                }
              }}
            >
              <TableCell>{item.itemId}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.preferredZone}</TableCell>
              <TableCell>{formatDate(item.expiryDate)}</TableCell>
              <TableCell>
                <Tooltip title="Delete item">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(item)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {wasteItems.map(item => (
        <Card 
          key={item.id}
          elevation={3}
          sx={{
            bgcolor: darkMode ? 'background.paper' : 'background.default'
          }}
        >
          <CardContent>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold"
              color={darkMode ? 'text.primary' : 'text.secondary'}
            >
              {item.name} ({item.itemId})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Zone: {item.preferredZone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expires: {formatDate(item.expiryDate)}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteClick(item)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );

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
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{
            bgcolor: darkMode ? 'error.dark' : 'error.light'
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: isMobile ? 2 : 4,
        bgcolor: darkMode ? 'background.default' : 'background.paper',
        minHeight: '100vh'
      }}
    >
      <Typography 
        variant={isMobile ? 'h5' : 'h4'} 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{
          fontWeight: 'bold',
          color: darkMode ? 'text.primary' : 'primary.main',
          mb: isMobile ? 2 : 4,
          fontSize: isTablet ? '1.75rem' : undefined
        }}
      >
        Expired Items Management
      </Typography>
      
      {wasteItems.length > 0 ? (
        isMobile ? renderMobileCards() : renderDesktopTable()
      ) : (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="200px"
        >
          <Typography 
            variant="h6" 
            color={darkMode ? 'text.secondary' : 'text.primary'}
          >
            No expired items found
          </Typography>
        </Box>
      )}

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: darkMode ? 'background.paper' : 'background.default',
            p: isMobile ? 1 : 2
          }
        }}
      >
        <DialogTitle color={darkMode ? 'text.primary' : 'text.secondary'}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText color={darkMode ? 'text.secondary' : 'text.primary'}>
            Are you sure you want to delete {itemToDelete?.name} (ID: {itemToDelete?.itemId})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            color={darkMode ? 'secondary' : 'primary'}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WasteManagement;