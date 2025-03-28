<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Card, CardActionArea, CardContent, CircularProgress, Alert } from "@mui/material";
import { fetchZones } from "../api/cargoApi";

const StorageZones = () => {
  const navigate = useNavigate();
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
    <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Storage Zones</Typography>
      <Typography paragraph>Select a zone to view details.</Typography>

      {zones.map((zone) => (
        <Card key={zone._id} sx={{ marginBottom: 2 }}>
          <CardActionArea onClick={() => navigate(`/zone/${zone.zoneName}`)}>
            <CardContent>
              <Typography variant="h6">{zone.zoneName}</Typography>
              <Typography>ID: {zone.containerId}</Typography>
              <Typography>Dimensions: {zone.width} × {zone.depth} × {zone.height} cm</Typography>
>>>>>>> b702363f9a81e0aa75c38393cc177be150790280
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Container>
  );
};

<<<<<<< HEAD
export default StorageZones;
=======
export default StorageZones;
>>>>>>> b702363f9a81e0aa75c38393cc177be150790280
