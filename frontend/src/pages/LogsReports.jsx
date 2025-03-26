import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const LogsReports = () => {
  return (
    <Container>
      <Typography variant="h4">Logs & Reports</Typography>
      <Typography>View all actions taken by astronauts.</Typography>
      <Button variant="contained" color="primary">Download Logs</Button>
    </Container>
  );
};

export default LogsReports;