import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, useMediaQuery, CircularProgress, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { fetchZones } from "../api/cargoApi";

const Rearrangement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const data = await fetchZones();
        setZones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadZones();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Storage Zones
      </Typography>
      <Typography align="center" paragraph>
        Select a zone to view its details.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
          gap: 3,
          mt: 3,
        }}
      >
        {zones.map((zone) => (
          <Box
            key={zone._id}
            onClick={() => navigate(`/zone/${zone.zoneName}`)}
            sx={{
              height: 160,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #1976d2",
              borderRadius: "12px",
              cursor: "pointer",
              "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.1)" },
              transition: "0.3s ease-in-out",
              padding: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">{zone.zoneName}</Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {zone.containerId}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {zone.width}×{zone.depth}×{zone.height} cm
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Rearrangement;