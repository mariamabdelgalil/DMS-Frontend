import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Delete, Face, AutoStories } from "@mui/icons-material";
import type { ReactNode } from "react";
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

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
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
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            onClick={() => navigate("/Dashboard")}
          >
            <AutoStories sx={{ color: "#8B4513", cursor: "pointer" }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#8B4513",
                cursor: "pointer",
              }}
            >
              DocSimple
            </Typography>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            <Typography variant="body1" color="#8B4513" fontWeight="700">
              Welcome, {user?.name}
            </Typography>
            <Delete
              sx={{ color: "#8B4513", cursor: "pointer" }}
              onClick={() => navigate("/recyclebin")}
            />
            <Face
              sx={{ color: "#8B4513", cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            />
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                color: "#fff",
                backgroundColor: "#8B4513",
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
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box p={3}>{children}</Box>
    </>
  );
};

export default Layout;
