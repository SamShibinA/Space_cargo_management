import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const CargoPlacement = () => {
  return (
    <Container>
      <Typography variant="h4">Cargo Placement</Typography>
      <Typography>Upload new shipment data and get placement recommendations.</Typography>
      <Button variant="contained" color="primary">Upload CSV</Button>
    </Container>
  );
};

export default CargoPlacement;