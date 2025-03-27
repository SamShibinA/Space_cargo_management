import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddIcon from "@mui/icons-material/Add";

export default function CargoPlacement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for modals
  const [openZoneModal, setOpenZoneModal] = useState(false);
  const [openItemModal, setOpenItemModal] = useState(false);

  // State for tab selection (Manual Entry or CSV Upload)
  const [zoneMode, setZoneMode] = useState(0);
  const [itemMode, setItemMode] = useState(0);

  // State for form data
  const [zoneData, setZoneData] = useState({
    zoneName: "",
    containerId: "",
    width: "",
    depth: "",
    height: "",
  });

  const [itemData, setItemData] = useState({
    itemId: "",
    name: "",
    width: "",
    depth: "",
    height: "",
    mass: "",
    priority: "",
    expiryDate: "N/A",
    usageLimit: "",
    preferredZone: "",
  });

  // State for CSV files
  const [zoneCSV, setZoneCSV] = useState(null);
  const [itemCSV, setItemCSV] = useState(null);

  // State for existing zones and items
  const [existingZones, setExistingZones] = useState([]);
  const [existingItems, setExistingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Fetch existing data when component mounts or when modals close
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch zones
        const zonesResponse = await fetch("http://localhost:8000/api/zones");
        if (zonesResponse.ok) {
          const zonesData = await zonesResponse.json();
          setExistingZones(zonesData);
        }

        // Fetch items
        const itemsResponse = await fetch("http://localhost:8000/api/items");
        if (itemsResponse.ok) {
          const itemsData = await itemsResponse.json();
          setExistingItems(itemsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [openZoneModal, openItemModal]);

  // Check if zone with this containerId already exists
  const zoneExists = (containerId) => {
    return existingZones.some(zone => zone.containerId === containerId);
  };

  // Check if item with this itemId already exists
  const itemExists = (itemId) => {
    return existingItems.some(item => item.itemId === itemId);
  };

  // Validate zone form
  const validateZoneForm = () => {
    const errors = {};
    if (!zoneData.containerId) errors.containerId = "Container ID is required";
    if (!zoneData.zoneName) errors.zoneName = "Zone Name is required";
    if (!zoneData.width) errors.width = "Width is required";
    if (!zoneData.depth) errors.depth = "Depth is required";
    if (!zoneData.height) errors.height = "Height is required";
    
    if (zoneExists(zoneData.containerId)) {
      errors.containerId = "A zone with this Container ID already exists";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate item form
  const validateItemForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!itemData.itemId) errors.itemId = "Item ID is required";
    if (!itemData.name) errors.name = "Name is required";
    if (!itemData.width) errors.width = "Width is required";
    if (!itemData.depth) errors.depth = "Depth is required";
    if (!itemData.height) errors.height = "Height is required";
    if (!itemData.mass) errors.mass = "Mass is required";
    
    if (itemData.priority && (itemData.priority < 1 || itemData.priority > 100)) {
      errors.priority = "Priority must be between 1 and 100";
    }
    
    if (itemData.expiryDate !== "N/A") {
      if (!itemData.expiryDate) {
        errors.expiryDate = "Please select a valid date";
      } else {
        const expiryDate = new Date(itemData.expiryDate);
        if (isNaN(expiryDate.getTime())) {
          errors.expiryDate = "Invalid date format";
        } else if (expiryDate <= today) {
          errors.expiryDate = "Expiry date must be in the future";
        }
      }
    }
    
    if (itemData.preferredZone === "") {
      errors.preferredZone = "Please select a preferred zone or choose 'None'";
    }
    
    if (itemExists(itemData.itemId)) {
      errors.itemId = "An item with this Item ID already exists";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to save Zone
  const handleSaveZone = async () => {
    setError("");
    if (!validateZoneForm()) return;

    try {
      const response = await fetch("http://localhost:8000/api/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zoneData),
      });
      
      if (response.ok) {
        alert("Zone added successfully!");
        setOpenZoneModal(false);
        setZoneData({
          zoneName: "",
          containerId: "",
          width: "",
          depth: "",
          height: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add zone");
      }
    } catch (error) {
      console.error("Error adding zone:", error);
      setError("Error adding zone. Please try again.");
    }
  };

  // Function to save Item
  const handleSaveItem = async () => {
    setError("");
    if (!validateItemForm()) return;

    // Prepare data for submission
    const submissionData = {
      ...itemData,
      expiryDate: itemData.expiryDate === "N/A" ? null : itemData.expiryDate,
      preferredZone: itemData.preferredZone === "" ? null : itemData.preferredZone
    };

    try {
      const response = await fetch("http://localhost:8000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      
      if (response.ok) {
        alert("Item added successfully!");
        setOpenItemModal(false);
        setItemData({
          itemId: "",
          name: "",
          width: "",
          depth: "",
          height: "",
          mass: "",
          priority: "",
          expiryDate: "N/A",
          usageLimit: "",
          preferredZone: "",
        });
        setTouchedFields({});
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      setError("Error adding item. Please try again.");
    }
  };

  // Handle expiry date selection change
  const handleExpiryDateChange = (e) => {
    const value = e.target.value;
    setItemData({ 
      ...itemData, 
      expiryDate: value
    });
    setTouchedFields({...touchedFields, expiryDate: true});
  };

  // Handle date input change
  const handleDateChange = (e) => {
    setItemData({ ...itemData, expiryDate: e.target.value });
    // Only validate if the date is complete (YYYY-MM-DD format)
    if (e.target.value.length === 10) {
      validateItemForm();
    }
  };

  // Handle field blur
  const handleFieldBlur = (fieldName) => {
    setTouchedFields({...touchedFields, [fieldName]: true});
    if (fieldName === "expiryDate" && itemData.expiryDate && itemData.expiryDate !== "N/A") {
      validateItemForm();
    }
  };

  // Function to upload Zone CSV
  const handleZoneCSVUpload = async () => {
    if (!zoneCSV) {
      setError("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", zoneCSV);

    try {
      const response = await fetch("http://localhost:8000/api/zones/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Zones uploaded successfully!");
        setOpenZoneModal(false);
        setZoneCSV(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to upload zones");
      }
    } catch (error) {
      console.error("Error uploading zones:", error);
      setError("Error uploading zones. Please try again.");
    }
  };

  // Function to upload Item CSV
  const handleItemCSVUpload = async () => {
    if (!itemCSV) {
      setError("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", itemCSV);

    try {
      const response = await fetch("http://localhost:8000/api/items/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Items uploaded successfully!");
        setOpenItemModal(false);
        setItemCSV(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to upload items");
      }
    } catch (error) {
      console.error("Error uploading items:", error);
      setError("Error uploading items. Please try again.");
    }
  };

  // Get unique zone names for dropdown
  const uniqueZoneNames = [...new Set(existingZones.map(zone => zone.zoneName))];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Cargo Placement
      </Typography>

      {/* Centered Containers */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
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

      {/* Add Zone Modal */}
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

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Tabs value={zoneMode} onChange={(e, newValue) => setZoneMode(newValue)}>
            <Tab label="Manual Entry" />
            <Tab label="CSV Upload" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {zoneMode === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Container ID *"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={zoneData.containerId}
                  onChange={(e) => setZoneData({ ...zoneData, containerId: e.target.value })}
                  onBlur={() => handleFieldBlur("containerId")}
                  error={!!formErrors.containerId || zoneExists(zoneData.containerId)}
                  helperText={formErrors.containerId || (zoneExists(zoneData.containerId) ? "This Container ID already exists" : "")}
                />
                <TextField
                  fullWidth
                  label="Zone Name *"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={zoneData.zoneName}
                  onChange={(e) => setZoneData({ ...zoneData, zoneName: e.target.value })}
                  onBlur={() => handleFieldBlur("zoneName")}
                  error={!!formErrors.zoneName}
                  helperText={formErrors.zoneName}
                />
                <TextField
                  fullWidth
                  label="Width (cm) *"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={zoneData.width}
                  onChange={(e) => setZoneData({ ...zoneData, width: e.target.value })}
                  onBlur={() => handleFieldBlur("width")}
                  error={!!formErrors.width}
                  helperText={formErrors.width}
                />
                <TextField
                  fullWidth
                  label="Depth (cm) *"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={zoneData.depth}
                  onChange={(e) => setZoneData({ ...zoneData, depth: e.target.value })}
                  onBlur={() => handleFieldBlur("depth")}
                  error={!!formErrors.depth}
                  helperText={formErrors.depth}
                />
                <TextField
                  fullWidth
                  label="Height (cm) *"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={zoneData.height}
                  onChange={(e) => setZoneData({ ...zoneData, height: e.target.value })}
                  onBlur={() => handleFieldBlur("height")}
                  error={!!formErrors.height}
                  helperText={formErrors.height}
                />
                <Button variant="contained" onClick={handleSaveZone}>
                  Save Zone
                </Button>
              </Box>
            )}

            {zoneMode === 1 && (
              <Box>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setZoneCSV(e.target.files[0])}
                  style={{ marginBottom: "16px" }}
                />
                <Button
                  variant="contained"
                  startIcon={<UploadFileIcon />}
                  onClick={handleZoneCSVUpload}
                  sx={{ mt: 2 }}
                >
                  Upload CSV
                </Button>
              </Box>
            )}
          </Box>
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

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Tabs value={itemMode} onChange={(e, newValue) => setItemMode(newValue)}>
            <Tab label="Manual Entry" />
            <Tab label="CSV Upload" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {itemMode === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Item ID *"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={itemData.itemId}
                  onChange={(e) => setItemData({ ...itemData, itemId: e.target.value })}
                  onBlur={() => handleFieldBlur("itemId")}
                  error={!!formErrors.itemId || itemExists(itemData.itemId)}
                  helperText={formErrors.itemId || (itemExists(itemData.itemId) ? "This Item ID already exists" : "")}
                />
                <TextField
                  fullWidth
                  label="Name *"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={itemData.name}
                  onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
                  onBlur={() => handleFieldBlur("name")}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
                <TextField
                  fullWidth
                  label="Width (cm) *"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={itemData.width}
                  onChange={(e) => setItemData({ ...itemData, width: e.target.value })}
                  onBlur={() => handleFieldBlur("width")}
                  error={!!formErrors.width}
                  helperText={formErrors.width}
                />
                <TextField
                  fullWidth
                  label="Depth (cm) *"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={itemData.depth}
                  onChange={(e) => setItemData({ ...itemData, depth: e.target.value })}
                  onBlur={() => handleFieldBlur("depth")}
                  error={!!formErrors.depth}
                  helperText={formErrors.depth}
                />
                <TextField
                  fullWidth
                  label="Height (cm) *"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={itemData.height}
                  onChange={(e) => setItemData({ ...itemData, height: e.target.value })}
                  onBlur={() => handleFieldBlur("height")}
                  error={!!formErrors.height}
                  helperText={formErrors.height}
                />
                <TextField
                  fullWidth
                  label="Mass (kg) *"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={itemData.mass}
                  onChange={(e) => setItemData({ ...itemData, mass: e.target.value })}
                  onBlur={() => handleFieldBlur("mass")}
                  error={!!formErrors.mass}
                  helperText={formErrors.mass}
                />
                <TextField
                  fullWidth
                  label="Priority (1-100)"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={itemData.priority}
                  onChange={(e) => setItemData({ ...itemData, priority: e.target.value })}
                  onBlur={() => handleFieldBlur("priority")}
                  error={!!formErrors.priority}
                  helperText={formErrors.priority}
                  inputProps={{ min: 1, max: 100 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Expiry Date</InputLabel>
                  <Select
                    value={itemData.expiryDate === "" ? "N/A" : itemData.expiryDate}
                    label="Expiry Date"
                    onChange={handleExpiryDateChange}
                    error={!!formErrors.expiryDate && touchedFields.expiryDate}
                  >
                    <MenuItem value="N/A">N/A (Never Expires)</MenuItem>
                    <MenuItem value="">
                      <em>Select Date</em>
                    </MenuItem>
                  </Select>
                  {formErrors.expiryDate && touchedFields.expiryDate && (
                    <FormHelperText error>{formErrors.expiryDate}</FormHelperText>
                  )}
                </FormControl>
                {itemData.expiryDate !== "N/A" && (
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={itemData.expiryDate || ""}
                    onChange={handleDateChange}
                    onBlur={() => handleFieldBlur("expiryDate")}
                    error={!!formErrors.expiryDate && touchedFields.expiryDate}
                    helperText={touchedFields.expiryDate && formErrors.expiryDate}
                  />
                )}
                <TextField
                  fullWidth
                  label="Usage Limit"
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={itemData.usageLimit}
                  onChange={(e) => setItemData({ ...itemData, usageLimit: e.target.value })}
                />
                <FormControl fullWidth sx={{ mb: 2 }} error={!!formErrors.preferredZone && touchedFields.preferredZone}>
                  <InputLabel>Preferred Zone</InputLabel>
                  <Select
                    value={itemData.preferredZone}
                    label="Preferred Zone"
                    onChange={(e) => setItemData({ ...itemData, preferredZone: e.target.value })}
                    onBlur={() => handleFieldBlur("preferredZone")}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {uniqueZoneNames.map((zoneName) => (
                      <MenuItem key={zoneName} value={zoneName}>
                        {zoneName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.preferredZone && touchedFields.preferredZone && (
                    <FormHelperText>{formErrors.preferredZone}</FormHelperText>
                  )}
                </FormControl>
                <Button variant="contained" onClick={handleSaveItem}>
                  Save Item
                </Button>
              </Box>
            )}

            {itemMode === 1 && (
              <Box>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setItemCSV(e.target.files[0])}
                  style={{ marginBottom: "16px" }}
                />
                <Button
                  variant="contained"
                  startIcon={<UploadFileIcon />}
                  onClick={handleItemCSVUpload}
                  sx={{ mt: 2 }}
                >
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