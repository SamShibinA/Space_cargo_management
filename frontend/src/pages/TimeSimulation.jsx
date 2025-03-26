import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const TimeSimulation = () => {
  return (
    <Container>
      <Typography variant="h4">Time Simulation</Typography>
      <Typography>Simulate time passage and track item usage.</Typography>
      <Button variant="contained" color="primary">Simulate Next Day</Button>
    </Container>
  );
};

export default TimeSimulation;