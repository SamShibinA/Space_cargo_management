import React from 'react';
import { Box, LinearProgress, Typography, Tooltip } from '@mui/material';

const ZoneProgress = ({ zone, onClick, isActive }) => {
  return (
    <Tooltip title={`${zone.zoneName} - ${zone.utilization.toFixed(1)}% utilized`}>
      <Box 
        sx={{ 
          mb: 2, 
          p: 1, 
          border: isActive ? '2px solid #1976d2' : '1px solid #ddd',
          borderRadius: 1,
          cursor: 'pointer',
          backgroundColor: isActive ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.05)'
          }
        }}
        onClick={() => onClick(zone)}
      >
        <Typography variant="body2" sx={{ mb: 1, fontWeight: isActive ? 'bold' : 'normal' }}>
          {zone.zoneName}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={zone.utilization} 
          sx={{ 
            height: 10,
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: zone.utilization > 90 ? '#f44336' : 
                            zone.utilization > 70 ? '#ff9800' : '#4caf50',
              borderRadius: 5
            }
          }} 
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
          {Math.round(zone.usedVolume/1000)} / {Math.round(zone.totalVolume/1000)} L
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default ZoneProgress;