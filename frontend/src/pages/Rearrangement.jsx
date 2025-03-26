import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const Rearrangement = () => {
  return (
    <Container>
      <Typography variant="h4">Rearrangement Optimization</Typography>
      <Typography>Suggest optimal rearrangements when space runs out.</Typography>
      <Button variant="contained" color="primary">Optimize Storage</Button>
    </Container>
  );
};

export default Rearrangement;