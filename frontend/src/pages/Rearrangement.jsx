import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const storageZones = {
  "Crew Quarters": { id: "contA" },
  "Airlock": { id: "contB" },
  "Medical Bay": { id: "contC" },
  "Laboratory": { id: "contD" },
  "Engineering": { id: "contE" },
  "Command Center": { id: "contF" },
  "Sanitation": { id: "contG" },
  "Storage Bay 1": { id: "contH" },
  "Storage Bay 2": { id: "contI" },
  "Emergency Storage": { id: "contJ" },
};

const Rearrangement = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box sx={{ p:0.1 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Storage Zones
      </Typography>
      <Typography align="center">Select a zone to view its details.</Typography>

      {/* Storage Zones in Grid Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
          gap: 3,
          mt: 3,
        }}
      >
        {Object.keys(storageZones).map((zone) => (
          <Box
            key={zone}
            onClick={() => navigate(`/zone/${zone}`)}
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
            <Typography variant="h6" fontWeight="bold">{zone}</Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {storageZones[zone].id}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Rearrangement;