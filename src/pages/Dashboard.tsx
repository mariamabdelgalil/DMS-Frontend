import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Card,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { Add, Folder } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

import {
  fetchWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "../services/dashboardService";

interface Workspace {
  _id: string;
  name: string;
  userNid: string;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const token = useSelector((state: RootState) => state.token);

  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [fetching, setFetching] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const [newName, setNewName] = useState("");

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );

  // Fetch all user workspaces
  const loadWorkspaces = async () => {
    if (!user?.nid) return;
    setFetching(true);
    try {
      const data = await fetchWorkspaces(user.nid, token!);
      if (data.success) setWorkspaces(data.workspaces);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create a new workspace
  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim() || !user?.nid) return;

    setLoading(true);
    try {
      const data = await createWorkspace(workspaceName, user.nid, token!);
      if (data.success) {
        setWorkspaces((prev) => [...prev, data.workspace]);
        setWorkspaceName("");
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit dialog
  const handleOpenEdit = (ws: Workspace) => {
    setSelectedWorkspace(ws);
    setNewName(ws.name);
    setEditOpen(true);
  };

  // Update workspace name
  const handleUpdateWorkspace = async () => {
    if (!selectedWorkspace) return;
    try {
      const data = await updateWorkspace(
        selectedWorkspace._id,
        newName,
        token!
      );
      if (data.success) {
        setWorkspaces((prev) =>
          prev.map((ws) =>
            ws._id === selectedWorkspace._id ? { ...ws, name: newName } : ws
          )
        );
        setEditOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete workspace confirmation
  const handleDeleteWorkspace = (id: string) => {
    setSelectedWorkspaceId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteWorkspace = async () => {
    if (!selectedWorkspaceId) return;
    try {
      const data = await deleteWorkspace(selectedWorkspaceId, token!);
      if (data.success) {
        setWorkspaces((prev) =>
          prev.filter((ws) => ws._id !== selectedWorkspaceId)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDeleteDialog(false);
      setSelectedWorkspaceId(null);
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#f9fafb">
      <Box p={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h5" fontWeight="bold" color="#8B4513">
            Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{
              color: "#8B4513",
              borderColor: "#8B4513",
              backgroundColor: "#d9c59fff",
            }}
          >
            Create Workspace
          </Button>
        </Box>

        {fetching ? (
          <Typography>Loading Workspaces...</Typography>
        ) : workspaces.length === 0 ? (
          <Card sx={{ padding: 4, textAlign: "center" }}>
            <Folder sx={{ fontSize: 40, color: "gray" }} />
            <Typography variant="h6">No workspaces yet</Typography>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Create First Workspace
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {workspaces.map((ws) => (
              <Grid key={ws._id}>
                <Card
                  sx={{
                    padding: 2,
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box
                      display="flex"
                      gap={2}
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/workspace/${ws._id}`)}
                    >
                      <Folder sx={{ fontSize: 35, color: "#8B4513" }} />
                      <Box>
                        <Typography fontWeight="600" sx={{ color: "#81531e" }}>
                          {ws.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Created on{" "}
                          {new Date(ws.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" gap={1} sx={{ marginLeft: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          borderRadius: "12px",
                          color: "#6b4f2c",
                          borderColor: "#c7b299",
                          "&:hover": { backgroundColor: "#f4ede4" },
                          padding: "2px 10px",
                        }}
                        onClick={() => handleOpenEdit(ws)}
                      >
                        Rename
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWorkspace(ws._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Create Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Workspace</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCreateWorkspace}>
            <TextField
              fullWidth
              label="Workspace Name"
              margin="normal"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, backgroundColor: "#d9c59fff" }}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Rename Workspace</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#d9c59fff" }}
            onClick={handleUpdateWorkspace}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Workspace</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete this workspace?
          </Typography>
          <Button
            variant="contained"
            fullWidth
            color="error"
            sx={{ mt: 2 }}
            onClick={confirmDeleteWorkspace}
          >
            Delete
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
