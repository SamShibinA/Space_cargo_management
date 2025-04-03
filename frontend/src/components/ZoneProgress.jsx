import React from 'react';
import { Box, LinearProgress, Typography, Paper } from '@mui/material';

const ZoneProgress = ({ zone, onClick, isActive }) => {
  return (
    <Paper 
      elevation={isActive ? 3 : 1} 
      onClick={() => onClick(zone)}
      sx={{ 
        p: 2, 
        mb: 2, 
        cursor: 'pointer',
        borderLeft: isActive ? '4px solid #3f51b5' : '4px solid transparent'
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        {zone.zoneName}
      </Typography>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress 
            variant="determinate" 
            value={zone.utilization} 
            color={zone.utilization > 90 ? 'error' : 'primary'}
          />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">
            {Math.round(zone.utilization)}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" display="block">
        {zone.activeItemCount} active items • {zone.expiredItemCount} expired
      </Typography>
    </Paper>
  );
};

export default ZoneProgress;