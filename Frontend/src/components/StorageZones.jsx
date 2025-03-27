import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Card, CardActionArea, CardContent } from "@mui/material";

const storageZones = {
  "Crew Quarters": { id: "contA", width: 200, depth: 150, height: 250 },
  "Airlock": { id: "contB", width: 100, depth: 100, height: 200 },
  "Medical Bay": { id: "contC", width: 150, depth: 150, height: 200 },
  "Laboratory": { id: "contD", width: 250, depth: 200, height: 250 },
  "Engineering": { id: "contE", width: 180, depth: 180, height: 220 },
  "Command Center": { id: "contF", width: 120, depth: 120, height: 180 },
  "Sanitation": { id: "contG", width: 100, depth: 100, height: 150 },
  "Storage Bay 1": { id: "contH", width: 300, depth: 200, height: 300 },
  "Storage Bay 2": { id: "contI", width: 300, depth: 200, height: 300 },
  "Emergency Storage": { id: "contJ", width: 150, depth: 100, height: 150 },
};

const StorageZones = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4">Storage Zones</Typography>
      <Typography>Select a zone to view details.</Typography>

      {Object.keys(storageZones).map((zone) => (
        <Card key={zone} sx={{ marginBottom: 2 }}>
          <CardActionArea onClick={() => navigate(`/zone/${zone}`)}>
            <CardContent>
              <Typography variant="h6">{zone}</Typography>
              <Typography>ID: {storageZones[zone].id}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Container>
  );
};

export default StorageZones;
