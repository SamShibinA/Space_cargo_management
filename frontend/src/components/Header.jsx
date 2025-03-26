import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ThemeContext } from "../App";

export default function Header({ toggleDrawer }) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // ✅ Detect mobile screens

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
            display: isMobile ? "block" : "block", // ✅ Show menu button always
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
