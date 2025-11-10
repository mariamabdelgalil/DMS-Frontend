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
import { Add, Folder, HourglassBottom } from "@mui/icons-material";
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
      <Box p={{ xs: 2, sm: 3, md: 4 }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          mb={{ xs: 3, md: 4 }}
          gap={{ xs: 2, sm: 0 }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="#8B4513"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{
              color: "#8B4513",
              textTransform: "none",
              borderColor: "#8B4513",
              backgroundColor: "#d9c59fff",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Create Workspace
          </Button>
        </Box>

        {fetching ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <HourglassBottom fontSize="large" />
            <Typography sx={{ textAlign: "center" }}>
              Loading Workspaces...
            </Typography>
          </Box>
        ) : workspaces.length === 0 ? (
          <Card
            sx={{
              padding: { xs: 2, sm: 3, md: 4 },
              textAlign: "center",
            }}
          >
            <Folder sx={{ fontSize: 40, color: "gray" }} />
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              No workspaces yet
            </Typography>
            <Button
              sx={{ mt: 2, width: { xs: "100%", sm: "auto" } }}
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Create First Workspace
            </Button>
          </Card>
        ) : (
          <Grid container spacing={{ xs: 7, sm: 2, md: 3 }}>
            {workspaces.map((ws) => (
              <Grid key={ws._id}>
                <Card
                  sx={{
                    padding: { xs: 1.5, sm: 1 },
                    "&:hover": { boxShadow: 4 },
                    height: "100%",
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    gap={{ xs: 2, sm: 0 }}
                  >
                    <Box
                      display="flex"
                      gap={2}
                      sx={{
                        cursor: "pointer",
                        flex: 1,
                        width: { xs: "100%", sm: "auto" },
                      }}
                      onClick={() => navigate(`/workspace/${ws._id}`)}
                    >
                      <Folder
                        sx={{
                          fontSize: { xs: 30, sm: 35 },
                          color: "#8B4513",
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          fontWeight="600"
                          sx={{
                            color: "#81531e",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            wordBreak: "break-word",
                            marginTop: 1,
                          }}
                        >
                          {ws.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          Created on{" "}
                          {new Date(ws.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      display="flex"
                      gap={1}
                      sx={{
                        marginLeft: { xs: 0, sm: 1 },
                        width: { xs: "100%", sm: "auto" },
                        flexDirection: { xs: "row", sm: "row" },
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          borderRadius: "12px",
                          color: "#6b4f2c",
                          borderColor: "#c7b299",
                          "&:hover": { backgroundColor: "#f4ede4" },
                          padding: { xs: "4px 8px", sm: "2px 10px" },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          flex: { xs: 1, sm: "0 0 auto" },
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
                        sx={{
                          textTransform: "none",
                          borderRadius: "12px",
                          padding: { xs: "4px 8px", sm: "2px 10px" },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          flex: { xs: 1, sm: "0 0 auto" },
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 2, sm: 3 },
            width: { xs: "calc(100% - 32px)", sm: "400px" },
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
          Create Workspace
        </DialogTitle>
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
              sx={{
                mt: 2,
                backgroundColor: "#d9c59fff",
                textTransform: "none",
              }}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 2, sm: 3 },
            width: { xs: "calc(100% - 32px)", sm: "400px" },
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
          Rename Workspace
        </DialogTitle>
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
            sx={{ mt: 2, textTransform: "none", backgroundColor: "#6b4f2c" }}
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
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 2, sm: 3 },
            width: { xs: "calc(100% - 32px)", sm: "400px" },
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
          Delete Workspace
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              mt: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Are you sure you want to delete this workspace? This action cannot
            be undone. Fakkar fel mawdooo3
          </Typography>
          <Button
            variant="contained"
            fullWidth
            color="error"
            sx={{ mt: 2, textTransform: "none" }}
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
