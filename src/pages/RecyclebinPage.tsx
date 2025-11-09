import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  fetchDeletedDocuments,
  restoreDocument,
  permanentlyDeleteDocument,
} from "../services/recyclebinService";

interface Document {
  _id: string;
  name: string;
  uploadedAt: string;
}

const RecycleBinPage = () => {
  const token = useSelector((state: RootState) => state.token);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // For confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedDocName, setSelectedDocName] = useState<string>("");

  const loadDeletedDocuments = async () => {
    try {
      setLoading(true);
      const data = await fetchDeletedDocuments(token!);
      if (data.success) {
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreDocument(id, token!);
      loadDeletedDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDeleteDialog = (id: string, name: string) => {
    setSelectedDocId(id);
    setSelectedDocName(name);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDocId(null);
    setSelectedDocName("");
  };

  const handleConfirmDelete = async () => {
    if (!selectedDocId) return;
    try {
      await permanentlyDeleteDocument(selectedDocId, token!);
      loadDeletedDocuments();
    } catch (err) {
      console.error(err);
    } finally {
      handleCloseDialog();
    }
  };

  useEffect(() => {
    loadDeletedDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="#8B4513">
        Recycle Bin
      </Typography>

      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : documents.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            No deleted documents.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc._id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      sx={{ mr: 1, textTransform: "none" }}
                      onClick={() => handleRestore(doc._id)}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(doc._id, doc.name)}
                      sx={{ textTransform: "none" }}
                    >
                      Delete Permanently
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Permanent Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete{" "}
            <strong>{selectedDocName}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecycleBinPage;
