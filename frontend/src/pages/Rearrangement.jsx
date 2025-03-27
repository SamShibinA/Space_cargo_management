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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Storage Zones
      </Typography>
      <Typography align="center">Select a zone to view its details.</Typography>

      {/* ✅ Storage Zones in Flexbox Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          mt: 3,
        }}
      >
        {Object.keys(storageZones).map((zone) => (
          <Box
            key={zone}
            onClick={() => navigate(`/zone/${zone}`)}
            sx={{
              width: 160,
              height: 160,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #1976d2", // ✅ Proper Dashed Border
              borderRadius: "12px", // ✅ Softer rounded corners
              cursor: "pointer",
              "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.1)" },
              transition: "0.3s ease-in-out",
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
