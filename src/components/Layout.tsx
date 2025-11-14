import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Delete,
  Face,
  AutoStories,
  Menu as MenuIcon,
} from "@mui/icons-material";
import type { ReactNode } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { setLogout } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <>
      {/* AppBar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#f5f0e6",
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={{ xs: 0.5, sm: 1 }}
            onClick={() => navigate("/Dashboard")}
            sx={{ flexShrink: 0 }}
          >
            <AutoStories
              sx={{
                color: "#8B4513",
                cursor: "pointer",
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#8B4513",
                cursor: "pointer",
                fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
              }}
            >
              DocSimple
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box display={{ xs: "none", md: "flex" }} alignItems="center">
            <Typography
              variant="body1"
              color="#8B4513"
              fontWeight="700"
              sx={{
                fontSize: { md: "0.9rem", lg: "1rem" },
                whiteSpace: "nowrap",
                // overflow: "hidden",
                // textOverflow: "ellipsis",
                maxWidth: "200px",
              }}
            >
              Welcome, {user?.name}
            </Typography>
            <IconButton
              sx={{ color: "#8B4513", p: 1, marginLeft: 3 }}
              onClick={() => navigate("/recyclebin")}
            >
              <Delete />
            </IconButton>
            <IconButton
              sx={{ color: "#8B4513", marginRight: 2 }}
              onClick={() => navigate("/profile")}
            >
              <Face />
            </IconButton>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                color: "#fff",
                backgroundColor: "#8B4513",
                textTransform: "none",
                fontSize: { md: "0.8rem", lg: "0.875rem" },
                px: { md: 2, lg: 3 },
                "&:hover": {
                  backgroundColor: "#a08978ff",
                  color: "white",
                  borderColor: "#a08978ff",
                },
              }}
            >
              Logout
            </Button>
          </Box>

          {/* Tablet Navigation (sm to md) */}
          <Box
            display={{ xs: "none", sm: "flex", md: "none" }}
            gap={1}
            alignItems="center"
          >
            <IconButton
              sx={{ color: "#8B4513", p: 0.75 }}
              onClick={() => navigate("/recyclebin")}
            >
              <Delete fontSize="small" />
            </IconButton>
            <IconButton
              sx={{ color: "#8B4513", p: 0.75 }}
              onClick={() => navigate("/profile")}
            >
              <Face fontSize="small" />
            </IconButton>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                color: "#fff",
                backgroundColor: "#8B4513",
                textTransform: "none",
                fontSize: "0.75rem",
                px: 1.5,
                py: 0.5,
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "#a08978ff",
                  color: "white",
                  borderColor: "#a08978ff",
                },
              }}
            >
              Logout
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <Box display={{ xs: "flex", sm: "none" }} alignItems="center">
            <IconButton
              onClick={handleMenuOpen}
              sx={{ color: "#8B4513", p: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiPaper-root": {
                minWidth: "200px",
                mt: 1,
              },
            }}
          >
            <MenuItem
              disabled
              sx={{ opacity: 1, "&:hover": { backgroundColor: "transparent" } }}
            >
              <Typography
                variant="body2"
                color="#8B4513"
                fontWeight="600"
                sx={{ fontSize: "0.85rem" }}
              >
                Welcome, {user?.name}
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/profile")}>
              <Face sx={{ mr: 1, color: "#8B4513", fontSize: "1.2rem" }} />
              <Typography sx={{ fontSize: "0.9rem" }}>Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/recyclebin")}>
              <Delete sx={{ mr: 1, color: "#8B4513", fontSize: "1.2rem" }} />
              <Typography sx={{ fontSize: "0.9rem" }}>Recycle Bin</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                handleMenuClose();
              }}
              sx={{
                backgroundColor: "#8B4513",
                color: "white",
                mt: 1,
                "&:hover": {
                  backgroundColor: "#a08978ff",
                },
              }}
            >
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box p={{ xs: 2, sm: 3 }}>{children}</Box>
    </>
  );
};

export default Layout;
