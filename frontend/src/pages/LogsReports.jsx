import React, { useState } from "react";
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
} from "@mui/material";
import { Search, FileDownload, Refresh, Visibility, Delete } from "@mui/icons-material";
import { saveAs } from "file-saver";
 
const sampleLogs = [
  { id: 1, user: "User1", action: "placement", item: "ItemA", zone: "Zone1", timestamp: "2025-03-27 12:00" },
  { id: 2, user: "User2", action: "retrieval", item: "ItemB", zone: "Zone2", timestamp: "2025-03-27 13:00" },
  { id: 3, user: "User3", action: "rearrangement", item: "ItemC", zone: "Zone3", timestamp: "2025-03-27 14:00" },
];

const LogsReports = () => {
  const [logs, setLogs] = useState(sampleLogs);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", itemId: "", userId: "", actionType: "" });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const filteredLogs = sampleLogs.filter((log) => {
      const matchesDate =
        (!filters.startDate || log.timestamp >= filters.startDate) &&
        (!filters.endDate || log.timestamp <= filters.endDate + " 23:59:59");
      const matchesItem = !filters.itemId || log.item.includes(filters.itemId);
      const matchesUser = !filters.userId || log.user.includes(filters.userId);
      const matchesAction = !filters.actionType || log.action === filters.actionType;

      return matchesDate && matchesItem && matchesUser && matchesAction;
    });

    setLogs(filteredLogs);
  };

  const resetFilters = () => {
    setFilters({ startDate: "", endDate: "", itemId: "", userId: "", actionType: "" });
    setLogs(sampleLogs);
  };

  const downloadLogs = () => {
    const csvContent = [
      ["ID", "User", "Action", "Item", "Zone", "Timestamp"],
      ...logs.map((log) => [log.id, log.user, log.action, log.item, log.zone, log.timestamp]),
    ]
      .map((e) => e.join(","))
      .join("\n");
    saveAs(new Blob([csvContent], { type: "text/csv" }), "logs.csv");
  };

  const handleDeleteLog = (id) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Cargo Logs</Typography>
        <Box>
          <Button variant="contained" startIcon={<FileDownload />} onClick={downloadLogs} sx={{ mr: 2 }}>
            Export
          </Button>
          <Tooltip title="Refresh">
            <IconButton color="primary" sx={{ borderRadius: "8px", p: 1 }} onClick={resetFilters}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField label="Start Date" type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} sx={{ width: 180 }} InputLabelProps={{ shrink: true }} />
        <TextField label="End Date" type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} sx={{ width: 180 }} InputLabelProps={{ shrink: true }} />
        <TextField label="Item ID" name="itemId" value={filters.itemId} onChange={handleFilterChange} sx={{ width: 180 }} />
        <TextField label="User ID" name="userId" value={filters.userId} onChange={handleFilterChange} sx={{ width: 180 }} />
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Action Type</InputLabel>
          <Select name="actionType" value={filters.actionType} onChange={handleFilterChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="placement">Placement</MenuItem>
            <MenuItem value="retrieval">Retrieval</MenuItem>
            <MenuItem value="rearrangement">Rearrangement</MenuItem>
            <MenuItem value="disposal">Disposal</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outlined" onClick={resetFilters}>Reset</Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {["ID", "User", "Action", "Item", "Zone", "Timestamp", "Actions"].map((header) => (
                <TableCell key={header} sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>{log.id}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.item}</TableCell>
                <TableCell>{log.zone}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton sx={{ borderRadius: "8px", p: 1 }}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton sx={{ borderRadius: "8px", p: 1, color: "error.main" }} onClick={() => handleDeleteLog(log.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LogsReports;