import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  IconButton,
  Tabs,
  Tab,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddIcon from "@mui/icons-material/Add";

export default function CargoPlacement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ✅ Detect Mobile Screens

  // State for modals
  const [openZoneModal, setOpenZoneModal] = useState(false);
  const [openItemModal, setOpenItemModal] = useState(false);

  // State for tab selection (Manual Entry or CSV Upload)
  const [zoneMode, setZoneMode] = useState(0);
  const [itemMode, setItemMode] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Cargo Placement
      </Typography>

      {/* ✅ Centered Containers */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // ✅ Stack on mobile
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          mt: 2,
        }}
      >
        {/* Add Zone Container */}
        <Box
          onClick={() => setOpenZoneModal(true)}
          sx={{
            width: 160,
            height: 160,
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
            width: 160,
            height: 160,
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

      {/* ✅ Add Zone Modal */}
      <Modal open={openZoneModal} onClose={() => setOpenZoneModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 450,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            "&::-webkit-scrollbar": { display: "none" }, 
            scrollbarWidth: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Zone
          </Typography>

          <Tabs value={zoneMode} onChange={(e, newValue) => setZoneMode(newValue)}>
            <Tab label="Manual Entry" />
            <Tab label="CSV Upload" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {zoneMode === 0 && (
              <Box>
                <TextField fullWidth label="Zone Name" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Container ID" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Width (cm)" type="number" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Depth (cm)" type="number" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Height (cm)" type="number" variant="outlined" sx={{ mb: 2 }} />
                <Button variant="contained" onClick={() => setOpenZoneModal(false)}>
                  Save Zone
                </Button>
              </Box>
            )}

            {zoneMode === 1 && (
              <Box>
                <input type="file" accept=".csv" />
                <Button variant="contained" startIcon={<UploadFileIcon />} sx={{ mt: 2 }}>
                  Upload CSV
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>

      {/* ✅ Add Item Modal */}
      <Modal open={openItemModal} onClose={() => setOpenItemModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 450,
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            "&::-webkit-scrollbar": { display: "none" }, 
            scrollbarWidth: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Item
          </Typography>

          <Tabs value={itemMode} onChange={(e, newValue) => setItemMode(newValue)}>
            <Tab label="Manual Entry" />
            <Tab label="CSV Upload" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {itemMode === 0 && (
              <Box>
                <TextField fullWidth label="Item ID" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Name" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Width (cm)" type="number" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Depth (cm)" type="number" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Height (cm)" type="number" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Mass (kg)" type="number" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Priority (1-100)" type="number" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Expiry Date" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Usage Limit" type="number" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Preferred Zone" variant="outlined" sx={{ mb: 2 }} />
                <Button variant="contained" onClick={() => setOpenItemModal(false)}>
                  Save Item
                </Button>
              </Box>
            )}

            {itemMode === 1 && (
              <Box>
                <input type="file" accept=".csv" />
                <Button variant="contained" startIcon={<UploadFileIcon />} sx={{ mt: 2 }}>
                  Upload CSV
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
