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

  const handlePermanentDelete = async (id: string) => {
    if (!window.confirm("This will permanently delete the document. Continue?"))
      return;
    try {
      await permanentlyDeleteDocument(id, token!);
      loadDeletedDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDeletedDocuments();
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
