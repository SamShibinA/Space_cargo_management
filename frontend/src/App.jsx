import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import CargoPlacement from "./pages/CargoPlacement";
import Rearrangement from "./pages/Rearrangement";
import WasteManagement from "./pages/WasteManagement";
import LogsReports from "./pages/LogsReports";
import StorageZones from "./components/StorageZones";
import ZoneDetails from "./components/ZoneDetails";
import { Box, CssBaseline, Toolbar, ThemeProvider, createTheme } from "@mui/material";

export const ThemeContext = createContext();

const App = () => {
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDrawer = () => setOpen(!open);
  const toggleTheme = () => setDarkMode(!darkMode);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header toggleDrawer={toggleDrawer} />
          <Box display="flex">
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, transition: "margin-left 0.3s ease" }}>
              <Toolbar />
              <Routes>
                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" />} />

                {/* Main Pages */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cargo-placement" element={<CargoPlacement />} />
                <Route path="/rearrangement" element={<Rearrangement />} />
                <Route path="/waste-management" element={<WasteManagement />} />
                <Route path="/logs-reports" element={<LogsReports />} />
      

                {/* Storage Zones */}
                <Route path="/storage-zones" element={<StorageZones />} />
                <Route path="/zone/:zoneName" element={<ZoneDetails />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
