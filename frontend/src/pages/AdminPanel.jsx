import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const AdminPanel = () => {
  return (
    <Container>
      <Typography variant="h4">Admin Panel</Typography>
      <Typography>Manage users, settings, and monitor system efficiency.</Typography>
      <Button variant="contained" color="primary">Manage Users</Button>
    </Container>
  );
};

export default AdminPanel;