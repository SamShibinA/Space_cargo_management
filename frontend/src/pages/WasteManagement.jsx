import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const WasteManagement = () => {
  return (
    <Container>
      <Typography variant="h4">Waste Management</Typography>
      <Typography>Track expired/depleted items and manage waste disposal.</Typography>
      <Button variant="contained" color="primary">Identify Waste</Button>
    </Container>
  );
};

export default WasteManagement;
