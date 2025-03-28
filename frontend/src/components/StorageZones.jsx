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
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Container>
  );
};

export default StorageZones;
