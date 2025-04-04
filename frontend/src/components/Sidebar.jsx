import React, { useContext } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../App";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import ListAltIcon from "@mui/icons-material/ListAlt";


const drawerWidth = 240;

const NAVIGATION = [
  { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { title: "Cargo Placement", icon: <StorageIcon />, path: "/cargo-placement" },
  { title: "Rearrangement Optimization", icon: <SwapHorizIcon />, path: "/rearrangement" },
  { title: "Waste Management", icon: <DeleteIcon />, path: "/waste-management" },
  { title: "Logs & Reports", icon: <ListAltIcon />, path: "/logs-reports" },

];

export default function Sidebar({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ✅ Detect mobile screens

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"} // ✅ Mobile: Temporary Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer}
      sx={{
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 60,
          mt: isMobile ? "64px" : "56px", // ✅ Adjust margin to prevent hiding under header
          height: isMobile ? "calc(100vh - 64px)" : "100vh", // ✅ Prevent sidebar from hiding content
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
            onClick={() => {
              navigate(item.path);
              if (isMobile) toggleDrawer(); // ✅ Auto-close sidebar on mobile when an item is clicked
            }}
            sx={{
              backgroundColor: location.pathname === item.path ? "rgba(33, 150, 243, 0.2)" : "inherit",
              "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.3)" },
              color: darkMode ? "#fff" : "#000",
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? "#1976d2" : "inherit" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} sx={{ display: open ? "block" : "none" }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
