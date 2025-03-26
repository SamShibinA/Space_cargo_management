import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar, { Header } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CargoPlacement from "./pages/CargoPlacement";
import ItemRetrieval from "./pages/ItemRetrieval";
import Rearrangement from "./pages/Rearrangement";
import WasteManagement from "./pages/WasteManagement";
import TimeSimulation from "./pages/TimeSimulation";
import LogsReports from "./pages/LogsReports";
import ImportExport from "./pages/ImportExport";
import AdminPanel from "./pages/AdminPanel";
import { Box, CssBaseline, Toolbar, ThemeProvider, createTheme } from "@mui/material";

export const ThemeContext = createContext(); 

const drawerWidth = 240;

function App() {
  const [open, setOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false); 
  const toggleDrawer = () => setOpen(!open);
  const toggleTheme = () => setDarkMode(!darkMode);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
      },
      background: {
        default: darkMode ? "#121212" : "#f4f4f4",
        paper: darkMode ? "#1e1e1e" : "#fff",
      },
      text: {
        primary: darkMode ? "#fff" : "#000",
      },
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
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                mt: 8,
                ml: open ? `${drawerWidth}px` : "60px",
                transition: "margin-left 0.3s ease",
              }}
            >
              <Toolbar />
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cargo-placement" element={<CargoPlacement />} />
                <Route path="/item-retrieval" element={<ItemRetrieval />} />
                <Route path="/rearrangement" element={<Rearrangement />} />
                <Route path="/waste-management" element={<WasteManagement />} />
                <Route path="/time-simulation" element={<TimeSimulation />} />
                <Route path="/logs-reports" element={<LogsReports />} />
                <Route path="/import-export" element={<ImportExport />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
