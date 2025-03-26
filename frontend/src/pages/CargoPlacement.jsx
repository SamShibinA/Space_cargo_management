import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddIcon from "@mui/icons-material/Add";


export default function CargoPlacement() {
  const [file, setFile] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [rearrangements, setRearrangements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for modals
  const [openZoneModal, setOpenZoneModal] = useState(false);
  const [openItemModal, setOpenItemModal] = useState(false);

  // Handles file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handles file upload and API call
  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/placement", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPlacements(data.placements);
        setRearrangements(data.rearrangements);
      } else {
        setError("Failed to get placement recommendations.");
      }
    } catch (err) {
      setError("Error uploading file.");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cargo Placement
      </Typography>

      {/* File Upload Section */}
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <Button
        variant="contained"
        startIcon={<UploadFileIcon />}
        onClick={handleUpload}
        sx={{ ml: 2 }}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload and Process"}
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      {/* Two Small Containers for Add Zone & Add Items */}
      <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
        {/* Add Zone Container */}
        <Box
          onClick={() => setOpenZoneModal(true)}
          sx={{
            width: 150,
            height: 150,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #1976d2",
            borderRadius: 2,
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.1)" },
          }}
        >
          <IconButton color="primary">
            <AddBusinessIcon sx={{ fontSize: 50 }} />
          </IconButton>
          <Typography>Add Zone</Typography>
        </Box>

        {/* Add Items Container */}
        <Box
          onClick={() => setOpenItemModal(true)}
          sx={{
            width: 150,
            height: 150,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #1976d2",
            borderRadius: 2,
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.1)" },
          }}
        >
          <IconButton color="primary">
            <AddIcon sx={{ fontSize: 50 }} />
          </IconButton>
          <Typography>Add Item</Typography>
        </Box>
      </Box>

      {/* Add Zone Modal */}
      <Modal open={openZoneModal} onClose={() => setOpenZoneModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Zone
          </Typography>
          <TextField fullWidth label="Zone Name" variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Zone Capacity" variant="outlined" sx={{ mb: 2 }} />
          <Button variant="contained" onClick={() => setOpenZoneModal(false)}>
            Save Zone
          </Button>
        </Box>
      </Modal>

      {/* Add Item Modal */}
      <Modal open={openItemModal} onClose={() => setOpenItemModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Item
          </Typography>
          <TextField fullWidth label="Item Name" variant="outlined" sx={{ mb: 2 }} />
          <TextField fullWidth label="Item Size" variant="outlined" sx={{ mb: 2 }} />
          <Button variant="contained" onClick={() => setOpenItemModal(false)}>
            Save Item
          </Button>
        </Box>
      </Modal>

      {/* Suggested Placements Table */}
      {placements.length > 0 && (
        <>
          <Typography variant="h6" mt={3}>
            Suggested Placements
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item ID</TableCell>
                  <TableCell>Container</TableCell>
                  <TableCell>Start Coordinates (W, D, H)</TableCell>
                  <TableCell>End Coordinates (W, D, H)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {placements.map((placement, index) => (
                  <TableRow key={index}>
                    <TableCell>{placement.itemId}</TableCell>
                    <TableCell>{placement.containerId}</TableCell>
                    <TableCell>
                      ({placement.position.startCoordinates.width}, {placement.position.startCoordinates.depth}, {placement.position.startCoordinates.height})
                    </TableCell>
                    <TableCell>
                      ({placement.position.endCoordinates.width}, {placement.position.endCoordinates.depth}, {placement.position.endCoordinates.height})
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
