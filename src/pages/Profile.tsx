import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/features/authSlice";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

const ProfilePage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const token = useSelector((state: RootState) => state.token);

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BASE_URL}/user/profile/update-name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong!");
      } else {
        setMessage("Name updated successfully");

        dispatch(updateUser({ ...user, name }));
      }
    } catch {
      setMessage("Network error or server not responding");
    }

    setLoading(false);
  };

  return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Paper elevation={3} sx={{ padding: 4, width: "400px" }}>
        <Typography variant="h5" mb={2}>
          My Profile
        </Typography>

        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Email"
          fullWidth
          value={user?.email || ""}
          disabled
          sx={{ mb: 2 }}
        />

        <TextField
          label="National ID"
          fullWidth
          value={user?.nid || ""}
          disabled
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          disabled={loading}
          sx={{
            color: "#fff",
            backgroundColor: "#8B4513",
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>

        {message && (
          <Typography
            mt={2}
            textAlign="center"
            color={message.includes("success") ? "green" : "error"}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
