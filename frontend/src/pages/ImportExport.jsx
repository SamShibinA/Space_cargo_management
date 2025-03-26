import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const ImportExport = () => {
  return (
    <Container>
      <Typography variant="h4">Import/Export</Typography>
      <Typography>Upload or download cargo and storage data.</Typography>
      <Button variant="contained" color="primary">Import CSV</Button>
    </Container>
  );
};

export default ImportExport;
