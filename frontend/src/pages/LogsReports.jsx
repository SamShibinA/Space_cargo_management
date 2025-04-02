import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const LogsReports = () => {
  const [logs, setLogs] = useState([]);
  const [originalLogs, setOriginalLogs] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    itemId: "",
    actionType: "",
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logs");
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
        setOriginalLogs(data);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const filteredLogs = originalLogs.filter((log) => {
      const matchesDate =
        (!filters.startDate ||
          new Date(log.timestamp) >= new Date(filters.startDate)) &&
        (!filters.endDate ||
          new Date(log.timestamp) <= new Date(filters.endDate + " 23:59:59"));
      const matchesItem = !filters.itemId || log.item.includes(filters.itemId);
      const matchesAction =
        !filters.actionType || log.action === filters.actionType;

      return matchesDate && matchesItem && matchesAction;
    });

    setLogs(filteredLogs);
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      itemId: "",
      actionType: "",
    });
    setLogs(originalLogs);
  };

  const handleView = (log) => {
    setSelectedLog(log);
    setOpenViewDialog(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" textAlign={isMobile ? "center" : "left"}>
          Cargo Logs
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          sx={{ width: isMobile ? "100%" : 180 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          sx={{ width: isMobile ? "100%" : 180 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Item ID"
          name="itemId"
          value={filters.itemId}
          onChange={handleFilterChange}
          sx={{ width: isMobile ? "100%" : 180 }}
        />
        <FormControl sx={{ width: isMobile ? "100%" : 200 }}>
          <InputLabel>Action Type</InputLabel>
          <Select
            name="actionType"
            value={filters.actionType}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="placement">Placement</MenuItem>
            <MenuItem value="retrieval">Retrieval</MenuItem>
            <MenuItem value="rearrangement">Rearrangement</MenuItem>
            <MenuItem value="disposal">Disposal</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="outlined" onClick={resetFilters}>
          Reset
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", boxShadow: 3, overflowX: "auto" }}
      >
        <Table
          size={isMobile ? "small" : "medium"}
          sx={{ display: isMobile ? "block" : "table" }}
        >
          <TableHead>
            <TableRow>
              {["User", "Action", "Item", "Zone", "Timestamp", "Actions"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "primary.light",
                      color: "white",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.item}</TableCell>
                <TableCell>{log.zone}</TableCell>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton
                      sx={{ borderRadius: "8px", p: 1 }}
                      onClick={() => handleView(log)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <DialogContentText>
              <strong>User:</strong> {selectedLog.user} <br />
              <strong>Action:</strong> {selectedLog.action} <br />
              <strong>Item:</strong> {selectedLog.item} <br />
              <strong>Zone:</strong> {selectedLog.zone} <br />
              <strong>Timestamp:</strong>{" "}
              {new Date(selectedLog.timestamp).toLocaleString()} <br />
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LogsReports;
