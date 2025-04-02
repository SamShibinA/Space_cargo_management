import React, { useState, useEffect, useContext } from "react";
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
  DialogTitle,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";
import { Visibility, FilterAlt } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ThemeContext } from "../App";

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { darkMode } = useContext(ThemeContext);

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
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      itemId: "",
      actionType: "",
    });
    setLogs(originalLogs);
    setMobileFiltersOpen(false);
  };

  const handleView = (log) => {
    setSelectedLog(log);
    setOpenViewDialog(true);
  };

  const renderTable = () => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "12px",
        boxShadow: 3,
        bgcolor: darkMode ? "background.paper" : "background.default",
      }}
    >
      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            {["User", "Action", "Item", "Zone", "Timestamp", "Actions"].map(
              (header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: "bold",
                    bgcolor: darkMode ? "primary.dark" : "primary.light",
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
            <TableRow
              key={log.id}
              hover
              sx={{
                bgcolor: darkMode ? "background.default" : "background.paper",
                "&:hover": {
                  bgcolor: darkMode ? "action.hover" : "action.hover",
                },
              }}
            >
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
                    size={isMobile ? "small" : "medium"}
                    onClick={() => handleView(log)}
                    sx={{ color: darkMode ? "text.primary" : "primary.main" }}
                  >
                    <Visibility fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {logs.map((log) => (
        <Card
          key={log.id}
          elevation={3}
          sx={{
            bgcolor: darkMode ? "background.paper" : "background.default",
          }}
        >
          <CardContent>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color={darkMode ? "text.primary" : "text.secondary"}
            >
              {log.action} - {log.item}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {log.zone} • {new Date(log.timestamp).toLocaleString()}
            </Typography>
            <Typography
              variant="body2"
              mt={1}
              color={darkMode ? "text.secondary" : "text.primary"}
            >
              User: {log.user}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              size="small"
              startIcon={<Visibility />}
              onClick={() => handleView(log)}
              color={darkMode ? "secondary" : "primary"}
            >
              Details
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );

  const renderFilters = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 2,
        mb: 3,
        flexWrap: "wrap",
      }}
    >
      <TextField
        label="Start Date"
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleFilterChange}
        sx={{
          minWidth: isMobile ? "100%" : 180,
          "& .MuiInputBase-root": {
            bgcolor: darkMode ? "background.paper" : "background.default",
          },
        }}
        InputLabelProps={{ shrink: true }}
        size={isMobile ? "small" : "medium"}
      />
      <TextField
        label="End Date"
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleFilterChange}
        sx={{
          minWidth: isMobile ? "100%" : 180,
          "& .MuiInputBase-root": {
            bgcolor: darkMode ? "background.paper" : "background.default",
          },
        }}
        InputLabelProps={{ shrink: true }}
        size={isMobile ? "small" : "medium"}
      />
      <TextField
        label="Item ID"
        name="itemId"
        value={filters.itemId}
        onChange={handleFilterChange}
        sx={{
          minWidth: isMobile ? "100%" : 180,
          "& .MuiInputBase-root": {
            bgcolor: darkMode ? "background.paper" : "background.default",
          },
        }}
        size={isMobile ? "small" : "medium"}
      />
      <FormControl
        sx={{
          minWidth: isMobile ? "100%" : 200,
          "& .MuiInputBase-root": {
            bgcolor: darkMode ? "background.paper" : "background.default",
          },
        }}
        size={isMobile ? "small" : "medium"}
      >
        <InputLabel>Action Type</InputLabel>
        <Select
          name="actionType"
          value={filters.actionType}
          onChange={handleFilterChange}
          label="Action Type"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="placement">Placement</MenuItem>
          <MenuItem value="retrieval">Retrieval</MenuItem>
          <MenuItem value="rearrangement">Rearrangement</MenuItem>
          <MenuItem value="disposal">Disposal</MenuItem>
        </Select>
      </FormControl>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: isMobile ? "100%" : "auto",
        }}
      >
        <Button
          variant="contained"
          onClick={applyFilters}
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
          color={darkMode ? "secondary" : "primary"}
        >
          Apply
        </Button>
        <Button
          variant="outlined"
          onClick={resetFilters}
          fullWidth={isMobile}
          size={isMobile ? "small" : "medium"}
          color={darkMode ? "secondary" : "primary"}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        bgcolor: darkMode ? "background.default" : "background.paper",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          mb: 3,
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          color={darkMode ? "text.primary" : "text.secondary"}
        >
          Cargo Logs
        </Typography>
        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            size="small"
            color={darkMode ? "secondary" : "primary"}
          >
            Filters
          </Button>
        )}
      </Box>

      {!isMobile ? (
        renderFilters()
      ) : (
        <Dialog
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: darkMode ? "background.paper" : "background.default",
            },
          }}
        >
          <DialogTitle color={darkMode ? "text.primary" : "text.secondary"}>
            Filter Logs
          </DialogTitle>
          <DialogContent>{renderFilters()}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => setMobileFiltersOpen(false)}
              color={darkMode ? "secondary" : "primary"}
            >
              Cancel
            </Button>
            <Button
              onClick={applyFilters}
              color={darkMode ? "secondary" : "primary"}
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {isMobile ? renderMobileCards() : renderTable()}

      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: darkMode ? "background.paper" : "background.default",
          },
        }}
      >
        <DialogTitle color={darkMode ? "text.primary" : "text.secondary"}>
          Log Details
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  color={darkMode ? "text.secondary" : "text.primary"}
                >
                  User
                </Typography>
                <Typography color={darkMode ? "text.primary" : "text.secondary"}>
                  {selectedLog.user}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  color={darkMode ? "text.secondary" : "text.primary"}
                >
                  Action
                </Typography>
                <Typography color={darkMode ? "text.primary" : "text.secondary"}>
                  {selectedLog.action}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  color={darkMode ? "text.secondary" : "text.primary"}
                >
                  Item
                </Typography>
                <Typography color={darkMode ? "text.primary" : "text.secondary"}>
                  {selectedLog.item}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle2"
                  color={darkMode ? "text.secondary" : "text.primary"}
                >
                  Zone
                </Typography>
                <Typography color={darkMode ? "text.primary" : "text.secondary"}>
                  {selectedLog.zone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color={darkMode ? "text.secondary" : "text.primary"}
                >
                  Timestamp
                </Typography>
                <Typography color={darkMode ? "text.primary" : "text.secondary"}>
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenViewDialog(false)}
            color={darkMode ? "secondary" : "primary"}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LogsReports;