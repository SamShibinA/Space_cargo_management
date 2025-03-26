import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

const ItemRetrieval = () => {
  return (
    <Container>
      <Typography variant="h4">Item Search & Retrieval</Typography>
      <TextField label="Search Item" variant="outlined" fullWidth />
      <Button variant="contained" color="primary">Retrieve Item</Button>
    </Container>
  );
};

export default ItemRetrieval;
