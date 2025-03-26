import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4">Dashboard</Typography>
      <Typography>Overview of cargo status, storage, and recent activities.</Typography>
      <Button variant="contained" color="primary">Add New Shipment</Button>
    </Container>
  );
};

export default Dashboard;