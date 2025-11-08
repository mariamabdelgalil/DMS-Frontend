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
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface Document {
  _id: string;
  name: string;
  uploadedAt: string;
}
const RecycleBinPage = () => {
  const token = useSelector((state: RootState) => state.token);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch soft deleted documents
  const fetchDeletedDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/documents/deleted/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Error fetching deleted docs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Restore document
  const handleRestore = async (id: string) => {
    try {
      await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/documents/${id}/restore`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchDeletedDocuments();
    } catch (err) {
      console.error("Error restoring doc:", err);
    }
  };

  // Permanently delete
  const handlePermanentDelete = async (id: string) => {
    if (!window.confirm("This will permanently delete the document. Continue?"))
      return;

    try {
      await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/documents/${id}/permanent-delete`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchDeletedDocuments();
    } catch (err) {
      console.error("Error permanently deleting doc:", err);
    }
  };

  useEffect(() => {
    fetchDeletedDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
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
                      sx={{ mr: 1 }}
                      onClick={() => handleRestore(doc._id)}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handlePermanentDelete(doc._id)}
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
    </Box>
  );
};

export default RecycleBinPage;
