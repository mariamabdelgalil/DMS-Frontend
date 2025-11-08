/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Folder, Search as SearchIcon } from "@mui/icons-material";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";

interface Document {
  _id: string;
  name: string;
  uploadedAt: string;
}

const WorkspacePage = () => {
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.token);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // filter and Sort State
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  // upload state
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // delete state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  //update
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [newName, setNewName] = useState("");

  //view
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<{
    name: string;
    type: string;
    data: string;
  } | null>(null);

  //preview
  const [hoveredPreview, setHoveredPreview] = useState<string | null>(null);
  const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      let url = `${
        import.meta.env.VITE_BASE_API_URL
      }/documents/workspace/${id}`;
      const params = new URLSearchParams();

      if (typeFilter) params.append("type", typeFilter);
      if (sortBy) params.append("sort", sortBy);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDocuments(data.documents);
    } catch (error) {
      console.log("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id, typeFilter, sortBy]);

  const fetchPreview = async (docId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/documents/${docId}/preview`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) setHoveredPreview(data.preview);
    } catch (error) {
      console.error("Error loading preview:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !id) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("workspaceId", id);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/documents/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        setDocuments((prev) => [...prev, data.document]);
        setOpenUploadDialog(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BASE_API_URL
        }/documents/${documentToDelete}/soft-delete`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (data.message === "Document soft-deleted successfully") {
        setDocuments((prev) =>
          prev.filter((doc) => doc._id !== documentToDelete)
        );
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleOpenEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setNewName(doc.name);
    setEditOpen(true);
  };

  const handleUpdateDocument = async () => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/documents/${
          selectedDocument._id
        }/metadata`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      const data = await response.json();
      if (data.document) {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc._id === selectedDocument._id ? { ...doc, name: newName } : doc
          )
        );
        setEditOpen(false);
      }
    } catch (error) {
      console.error("Error updating docs:", error);
    }
  };

  const handleViewDocument = async (docId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/documents/${docId}/view`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      if (data.success) {
        setViewingDocument({
          name: data.name,
          type: data.type,
          data: data.data,
        });
        setOpenViewDialog(true);
      }
    } catch (error) {
      console.error("Error viewing document:", error);
    }
  };

  const handleDownload = async (docId: string, filename: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/documents/${docId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Download failed");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchDocuments();
      return;
    }
    try {
      setLoading(true);
      const url = `${
        import.meta.env.VITE_BASE_API_URL
      }/documents/search?workspaceId=${id}&query=${searchQuery}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error searching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      {/* Header with Filters */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Workspace Documents
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            placeholder="Search documents..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    sx={{ cursor: "pointer" }}
                    onClick={handleSearch}
                  />
                </InputAdornment>
              ),
            }}
          />

          {/* Filter by Type */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Filter Type</InputLabel>
            <Select
              value={typeFilter}
              label="Filter Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="image/jpeg">Image (JPEG)</MenuItem>
              <MenuItem value="image/png">Image (PNG)</MenuItem>
              <MenuItem value="application/msword">Word</MenuItem>
            </Select>
          </FormControl>

          {/* Sorting */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="recent">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="sizeAsc">Smallest</MenuItem>
              <MenuItem value="sizeDesc">Largest</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{ backgroundColor: "#8B4513" }}
            onClick={() => setOpenUploadDialog(true)}
          >
            Upload Document
          </Button>
        </Stack>
      </Box>

      {/* Document List */}
      {loading ? (
        <Typography>Loading documents...</Typography>
      ) : documents.length === 0 ? (
        <Card
          sx={{
            padding: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Folder sx={{ fontSize: 40, color: "gray" }} />
          <Typography variant="h6" sx={{ mt: 2, color: "gray" }}>
            No documents found in this workspace
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {documents.map((doc) => (
            <Grid
              key={doc._id}
              onMouseEnter={() => {
                setHoveredDocId(doc._id);
                fetchPreview(doc._id);
              }}
              onMouseLeave={() => {
                setHoveredDocId(null);
                setHoveredPreview(null);
              }}
              sx={{ position: "relative" }}
            >
              <Card
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  "&:hover": { boxShadow: 4 },
                  cursor: "pointer",
                }}
                onClick={() => handleViewDocument(doc._id)}
              >
                <Typography fontWeight="600">{doc.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "#6b4f2c",
                    borderColor: "#c7b299",
                    "&:hover": { backgroundColor: "#f4ede4" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(doc);
                  }}
                >
                  Rename
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentToDelete(doc._id);
                    setOpenDeleteDialog(true);
                  }}
                >
                  Delete
                </Button>

                <Stack direction="column">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc._id, doc.name);
                    }}
                  >
                    Download
                  </Button>
                </Stack>
              </Card>

              {hoveredDocId === doc._id && hoveredPreview && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "-10px",
                    left: "120px",
                    width: "200px",
                    height: "auto",
                    backgroundColor: "white",
                    padding: "8px",
                    boxShadow: 3,
                    borderRadius: "8px",
                    zIndex: 10,
                  }}
                >
                  <img
                    src={hoveredPreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "6px",
                    }}
                  />
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{viewingDocument?.name}</DialogTitle>
        <DialogContent>
          {viewingDocument?.type.startsWith("image/") ? (
            <img
              src={viewingDocument.data}
              alt={viewingDocument.name}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          ) : viewingDocument?.type === "application/pdf" ? (
            <iframe
              src={viewingDocument.data}
              title={viewingDocument.name}
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          ) : (
            <Typography>File type not supported for viewing.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this document?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteDocument}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Rename Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            margin="normal"
          />

          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleUpdateDocument}
              sx={{ backgroundColor: "#d9c59fff" }}
            >
              Rename
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Typography>Select a file to upload</Typography>
          <TextField
            type="file"
            fullWidth
            onChange={(e) =>
              setSelectedFile((e.target as HTMLInputElement).files?.[0] || null)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile}
            sx={{ backgroundColor: "#d9c59fff" }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkspacePage;
