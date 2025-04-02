// import React, { useContext } from "react";
// import { AppBar, Toolbar, Typography, IconButton, useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import MenuIcon from "@mui/icons-material/Menu";
// import LightModeIcon from "@mui/icons-material/LightMode";
// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import { ThemeContext } from "../App";

// export default function Header({ toggleDrawer }) {
//   const { darkMode, toggleTheme } = useContext(ThemeContext);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md")); // ✅ Detect mobile screens

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         zIndex: (theme) => theme.zIndex.drawer + 1,
//         bgcolor: darkMode ? "#1e1e1e" : "#ffffff",
//         color: darkMode ? "#ffffff" : "#1976d2",
//         boxShadow: darkMode ? "none" : "0px 4px 10px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <Toolbar>
//         <IconButton
//           edge="start"
//           color="inherit"
//           onClick={toggleDrawer}
//           sx={{
//             display: isMobile ? "block" : "block", // ✅ Show menu button always
//             "&:hover": { backgroundColor: "transparent" },
//             "&:focus": { outline: "none" },
//           }}
//         >
//           <MenuIcon />
//         </IconButton>

//         <Typography variant="h6" noWrap sx={{ flexGrow: 1, color: darkMode ? "#ffffff" : "#1976d2" }}>
//           Space Station Cargo Management
//         </Typography>

//         <IconButton
//           color="inherit"
//           onClick={toggleTheme}
//           sx={{
//             "&:hover": { backgroundColor: "transparent" },
//             "&:focus": { outline: "none" },
//           }}
//         >
//           {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// }
import React, { useContext } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  useMediaQuery,
  Tooltip,
  Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ThemeContext } from "../App";

export default function Header({ toggleDrawer }) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: darkMode ? 'background.paper' : 'background.default',
        color: darkMode ? 'text.primary' : 'primary.main',
        boxShadow: theme.shadows[darkMode ? 0 : 4],
        transition: theme.transitions.create(['background-color', 'box-shadow'], {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      <Toolbar sx={{ 
        px: isMobile ? 1 : isTablet ? 2 : 3,
        minHeight: { xs: 56, sm: 64 } // Adjust toolbar height for different screens
      }}>
        {/* Menu Button - Always visible but with different spacing */}
        <Tooltip title="Toggle menu">
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{
              mr: isMobile ? 1 : 2,
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
              },
            }}
          >
            <MenuIcon fontSize={isMobile ? 'medium' : 'large'} />
          </IconButton>
        </Tooltip>

        {/* App Title - Responsive typography */}
        <Typography 
          variant={isMobile ? 'subtitle1' : 'h6'}
          noWrap
          component="div"
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            fontSize: {
              xs: '1rem',    // Mobile
              sm: '1.1rem',   // Tablet
              md: '1.25rem'   // Desktop
            },
            lineHeight: 1.2,
            ml: isMobile ? 0 : 1
          }}
        >
          Space Station Cargo
          {!isMobile && ' Management'} 
        </Typography>

        {/* Theme Toggle */}
        <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{
              p: isMobile ? 0.5 : 1,
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
              },
            }}
          >
            {darkMode ? (
              <LightModeIcon fontSize={isMobile ? 'medium' : 'large'} />
            ) : (
              <DarkModeIcon fontSize={isMobile ? 'medium' : 'large'} />
            )}
          </IconButton>
        </Tooltip>

        {/* Additional responsive elements could go here */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {/* Additional desktop-only elements */}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}