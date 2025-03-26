import React,{useContext } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography,Switch,IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; 
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import SearchIcon from "@mui/icons-material/Search";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNavigate,useLocation  } from "react-router-dom";
import { ThemeContext } from "../App";

const drawerWidth = 240;

const NAVIGATION = [
  { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { title: "Cargo Placement", icon: <StorageIcon />, path: "/cargo-placement" },
  { title: "Item Search & Retrieval", icon: <SearchIcon />, path: "/item-retrieval" },
  { title: "Rearrangement Optimization", icon: <SwapHorizIcon />, path: "/rearrangement" },
  { title: "Waste Management", icon: <DeleteIcon />, path: "/waste-management" },
  { title: "Time Simulation", icon: <ScheduleIcon />, path: "/time-simulation" },
  { title: "Logs & Reports", icon: <ListAltIcon />, path: "/logs-reports" },
  { title: "Import/Export", icon: <ImportExportIcon />, path: "/import-export" },
  { title: "Admin Panel", icon: <AdminPanelSettingsIcon />, path: "/admin-panel" },
];

export default function Sidebar({ open, toggleDrawer }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode } = useContext(ThemeContext); 
  
    return (
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 60,
            marginTop: "56px",
            height: "calc(100vh - 64px)",
            transition: "width 0.3s ease",
            overflowX: "hidden",
            bgcolor: darkMode ? "#1e1e1e" : "#fff", 
            color: darkMode ? "#fff" : "#000",
          },
        }}
      >
        <List>
          {NAVIGATION.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? "rgba(33, 150, 243, 0.2)" : "inherit",
                "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.3)" },
                color: darkMode ? "#fff" : "#000",
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? "#1976d2" : "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  }
  


export function Header({ toggleDrawer }) {
    const { darkMode, toggleTheme } = useContext(ThemeContext); 
  
    return (
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: darkMode ? "#1e1e1e" : "#ffffff", 
          color: darkMode ? "#ffffff" : "#1976d2", 
          boxShadow: darkMode ? "none" : "0px 4px 10px rgba(0, 0, 0, 0.1)", 
        }}
      >
        <Toolbar>

          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{
              "&:hover": { backgroundColor: "transparent" }, 
              "&:focus": { outline: "none" }, 
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: darkMode ? "#ffffff" : "#1976d2" }}>
            Space Station Cargo Management
          </Typography>
  
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{
              "&:hover": { backgroundColor: "transparent" }, 
              "&:focus": { outline: "none" }, 
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
  