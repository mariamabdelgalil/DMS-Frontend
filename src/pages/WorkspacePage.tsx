// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "../redux/store";
// import { Folder, Search, HourglassBottom } from "@mui/icons-material";
// import {
//   Box,
//   Typography,
//   Card,
//   Grid,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Stack,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   InputAdornment,
// } from "@mui/material";

// import {
//   fetchDocuments,
//   fetchPreview,
//   uploadDocument,
//   deleteDocument,
//   updateDocument,
//   viewDocument,
//   downloadDocument,
//   searchDocuments,
// } from "../services/documentService";

// interface Document {
//   _id: string;
//   name: string;
//   uploadedAt: string;
// }

// const WorkspacePage = () => {
//   const { id } = useParams();
//   const token = useSelector((state: RootState) => state.token);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [loading, setLoading] = useState(true);

//   // search state
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   // filter and Sort State
//   const [typeFilter, setTypeFilter] = useState<string>("");
//   const [sortBy, setSortBy] = useState<string>("");

//   // upload state
//   const [openUploadDialog, setOpenUploadDialog] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   // delete state
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

//   //update
//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedDocument, setSelectedDocument] = useState<Document | null>(
//     null
//   );
//   const [newName, setNewName] = useState("");

//   //view
//   const [openViewDialog, setOpenViewDialog] = useState(false);
//   const [viewingDocument, setViewingDocument] = useState<{
//     name: string;
//     type: string;
//     data: string;
//   } | null>(null);

//   //preview
//   const [hoveredPreview, setHoveredPreview] = useState<string | null>(null);
//   const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);
//   const loadDocuments = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchDocuments(token!, id!, typeFilter, sortBy);
//       if (data.success) setDocuments(data.documents);
//     } catch (err) {
//       console.error("Error fetching docs:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDocuments();
//   }, [id, typeFilter, sortBy]);

//   const handlePreview = async (docId: string) => {
//     try {
//       const data = await fetchPreview(token!, docId);
//       if (data.success) setHoveredPreview(data.preview);
//     } catch (error) {
//       console.error("Error loading preview:", error);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile || !id) return;
//     const data = await uploadDocument(token!, selectedFile, id);
//     if (data.success) {
//       setDocuments((prev) => [...prev, data.document]);
//       setOpenUploadDialog(false);
//       setSelectedFile(null);
//     }
//   };

//   const handleDelete = async () => {
//     if (!documentToDelete) return;
//     const data = await deleteDocument(token!, documentToDelete);
//     if (data.success) {
//       setDocuments((prev) =>
//         prev.filter((doc) => doc._id !== documentToDelete)
//       );
//       setOpenDeleteDialog(false);
//     }
//   };

//   const handleOpenEdit = (doc: Document) => {
//     setSelectedDocument(doc);
//     setNewName(doc.name);
//     setEditOpen(true);
//   };

//   const handleUpdate = async () => {
//     if (!selectedDocument) return;
//     const data = await updateDocument(token!, selectedDocument._id, newName);
//     if (data.document) {
//       setDocuments((prev) =>
//         prev.map((doc) =>
//           doc._id === selectedDocument._id ? { ...doc, name: newName } : doc
//         )
//       );
//       setEditOpen(false);
//     }
//   };

//   const handleView = async (docId: string) => {
//     const data = await viewDocument(token!, docId);
//     if (data.success) {
//       setViewingDocument({ name: data.name, type: data.type, data: data.data });
//       setOpenViewDialog(true);
//     }
//   };
//   const handleDownload = async (docId: string, name: string) => {
//     await downloadDocument(token!, docId, name);
//   };

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return loadDocuments();
//     const data = await searchDocuments(token!, id!, searchQuery);
//     setDocuments(data);
//   };

//   return (
//     <Box p={4}>
//       {/* Header with Filters */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={3}
//       >
//         <Typography variant="h5" fontWeight="bold" color="#8B4513">
//           Workspace Documents
//         </Typography>

//         <Stack direction="row" spacing={2}>
//           <TextField
//             placeholder="Search documents..."
//             size="small"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <Search sx={{ cursor: "pointer" }} onClick={handleSearch} />
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {/* Filter by Type */}
//           <FormControl size="small" sx={{ minWidth: 140 }}>
//             <InputLabel>Filter Type</InputLabel>
//             <Select
//               value={typeFilter}
//               label="Filter Type"
//               onChange={(e) => setTypeFilter(e.target.value)}
//             >
//               <MenuItem value="">All</MenuItem>
//               <MenuItem value="pdf">PDF</MenuItem>
//               <MenuItem value="image/jpeg">Image (JPEG)</MenuItem>
//               <MenuItem value="image/png">Image (PNG)</MenuItem>
//               <MenuItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
//                 Word
//               </MenuItem>
//             </Select>
//           </FormControl>

//           {/* Sorting */}
//           <FormControl size="small" sx={{ minWidth: 140 }}>
//             <InputLabel>Sort By</InputLabel>
//             <Select
//               value={sortBy}
//               label="Sort By"
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <MenuItem value="">None</MenuItem>
//               <MenuItem value="recent">Newest</MenuItem>
//               <MenuItem value="oldest">Oldest</MenuItem>
//               <MenuItem value="sizeAsc">Smallest</MenuItem>
//               <MenuItem value="sizeDesc">Largest</MenuItem>
//             </Select>
//           </FormControl>

//           <Button
//             variant="contained"
//             sx={{ backgroundColor: "#8B4513", textTransform: "none" }}
//             onClick={() => setOpenUploadDialog(true)}
//           >
//             Upload Document
//           </Button>
//         </Stack>
//       </Box>

//       {/* Document List */}
//       {loading ? (
//         <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
//           <HourglassBottom fontSize="large" />
//           <Typography>Loading Documents...</Typography>
//         </Box>
//       ) : documents.length === 0 ? (
//         <Card
//           sx={{
//             padding: 4,
//             textAlign: "center",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "200px",
//           }}
//         >
//           <Folder sx={{ fontSize: 40, color: "gray" }} />
//           <Typography variant="h6" sx={{ mt: 2, color: "gray" }}>
//             No documents found in this workspace
//           </Typography>
//         </Card>
//       ) : (
//         <Grid container spacing={3}>
//           {documents.map((doc) => (
//             <Grid
//               key={doc._id}
//               onMouseEnter={() => {
//                 setHoveredDocId(doc._id);
//                 handlePreview(doc._id);
//               }}
//               onMouseLeave={() => {
//                 setHoveredDocId(null);
//                 setHoveredPreview(null);
//               }}
//               sx={{ position: "relative" }}
//             >
//               <Card
//                 sx={{
//                   p: 3,
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 1,
//                   "&:hover": { boxShadow: 4 },
//                   cursor: "pointer",
//                 }}
//                 onClick={() => handleView(doc._id)}
//               >
//                 <Typography fontWeight="600">{doc.name}</Typography>
//                 <Typography variant="body2" color="textSecondary">
//                   Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
//                 </Typography>

//                 <Button
//                   size="small"
//                   variant="outlined"
//                   sx={{
//                     textTransform: "none",
//                     color: "#6b4f2c",
//                     borderColor: "#c7b299",
//                     "&:hover": { backgroundColor: "#f4ede4" },
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleOpenEdit(doc);
//                   }}
//                 >
//                   Rename
//                 </Button>

//                 <Button
//                   variant="outlined"
//                   color="error"
//                   size="small"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setDocumentToDelete(doc._id);
//                     setOpenDeleteDialog(true);
//                   }}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Delete
//                 </Button>

//                 <Stack direction="column">
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDownload(doc._id, doc.name);
//                     }}
//                     sx={{ textTransform: "none" }}
//                   >
//                     Download
//                   </Button>
//                 </Stack>
//               </Card>

//               {hoveredDocId === doc._id && hoveredPreview && (
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: "-10px",
//                     left: "120px",
//                     width: "200px",
//                     height: "auto",
//                     backgroundColor: "white",
//                     padding: "8px",
//                     boxShadow: 3,
//                     borderRadius: "8px",
//                     zIndex: 10,
//                   }}
//                 >
//                   <img
//                     src={hoveredPreview}
//                     alt="Preview"
//                     style={{
//                       width: "100%",
//                       height: "auto",
//                       borderRadius: "6px",
//                     }}
//                   />
//                 </Box>
//               )}
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <Dialog
//         open={openViewDialog}
//         onClose={() => setOpenViewDialog(false)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <DialogTitle>{viewingDocument?.name}</DialogTitle>
//         <DialogContent>
//           {viewingDocument?.type.startsWith("image/") ? (
//             <img
//               src={viewingDocument.data}
//               alt={viewingDocument.name}
//               style={{ width: "100%", height: "auto", borderRadius: "8px" }}
//             />
//           ) : viewingDocument?.type === "application/pdf" ? (
//             <iframe
//               src={viewingDocument.data}
//               title={viewingDocument.name}
//               width="100%"
//               height="600px"
//               style={{ border: "none" }}
//             />
//           ) : (
//             <Typography>File type not supported for viewing.</Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//       >
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete this document?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
//           <Button variant="contained" color="error" onClick={handleDelete}>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
//         <DialogTitle>Rename Document</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="New Name"
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             margin="normal"
//           />

//           <DialogActions>
//             <Button onClick={() => setEditOpen(false)}>Cancel</Button>
//             <Button
//               variant="contained"
//               onClick={handleUpdate}
//               sx={{ backgroundColor: "#6b4f2c" }}
//             >
//               Rename
//             </Button>
//           </DialogActions>
//         </DialogContent>
//       </Dialog>

//       {/* Upload Dialog */}
//       <Dialog
//         open={openUploadDialog}
//         onClose={() => setOpenUploadDialog(false)}
//       >
//         <DialogTitle>Upload Document</DialogTitle>
//         <DialogContent>
//           <Typography>Select a file to upload</Typography>
//           <TextField
//             type="file"
//             fullWidth
//             onChange={(e) =>
//               setSelectedFile((e.target as HTMLInputElement).files?.[0] || null)
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleUpload}
//             disabled={!selectedFile}
//             sx={{ backgroundColor: "#d9c59fff" }}
//           >
//             Upload
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default WorkspacePage;

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Folder, Search, HourglassBottom } from "@mui/icons-material";
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

import {
  fetchDocuments,
  fetchPreview,
  uploadDocument,
  deleteDocument,
  updateDocument,
  viewDocument,
  downloadDocument,
  searchDocuments,
} from "../services/documentService";

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
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchDocuments(token!, id!, typeFilter, sortBy);
      if (data.success) setDocuments(data.documents);
    } catch (err) {
      console.error("Error fetching docs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [id, typeFilter, sortBy]);

  const handlePreview = async (docId: string) => {
    try {
      const data = await fetchPreview(token!, docId);
      if (data.success) setHoveredPreview(data.preview);
    } catch (error) {
      console.error("Error loading preview:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !id) return;
    const data = await uploadDocument(token!, selectedFile, id);
    if (data.success) {
      setDocuments((prev) => [...prev, data.document]);
      setOpenUploadDialog(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    const data = await deleteDocument(token!, documentToDelete);
    if (data.success) {
      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== documentToDelete)
      );
      setOpenDeleteDialog(false);
    }
  };

  const handleOpenEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setNewName(doc.name);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedDocument) return;
    const data = await updateDocument(token!, selectedDocument._id, newName);
    if (data.document) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc._id === selectedDocument._id ? { ...doc, name: newName } : doc
        )
      );
      setEditOpen(false);
    }
  };

  const handleView = async (docId: string) => {
    const data = await viewDocument(token!, docId);
    if (data.success) {
      setViewingDocument({ name: data.name, type: data.type, data: data.data });
      setOpenViewDialog(true);
    }
  };
  const handleDownload = async (docId: string, name: string) => {
    await downloadDocument(token!, docId, name);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return loadDocuments();
    const data = await searchDocuments(token!, id!, searchQuery);
    setDocuments(data);
  };

  return (
    <Box p={{ xs: 2, sm: 3, md: 4 }}>
      {/* Header with Filters */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        mb={3}
        gap={2}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#8B4513"
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
        >
          Workspace Documents
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <TextField
            placeholder="Search documents..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            sx={{ width: { xs: "100%", sm: "auto" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search sx={{ cursor: "pointer" }} onClick={handleSearch} />
                </InputAdornment>
              ),
            }}
          />

          {/* Filter by Type */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 140 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
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
              <MenuItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                Word
              </MenuItem>
            </Select>
          </FormControl>

          {/* Sorting */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 140 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
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
            sx={{
              backgroundColor: "#8B4513",
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={() => setOpenUploadDialog(true)}
          >
            Upload Document
          </Button>
        </Stack>
      </Box>

      {/* Document List */}
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <HourglassBottom fontSize="large" />
          <Typography>Loading Documents...</Typography>
        </Box>
      ) : documents.length === 0 ? (
        <Card
          sx={{
            padding: { xs: 2, sm: 3, md: 4 },
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
        <Grid container spacing={{ xs: 7, sm: 2, md: 3 }}>
          {documents.map((doc) => (
            <Grid
              key={doc._id}
              onMouseEnter={() => {
                setHoveredDocId(doc._id);
                handlePreview(doc._id);
              }}
              onMouseLeave={() => {
                setHoveredDocId(null);
                setHoveredPreview(null);
              }}
              sx={{ position: "relative" }}
            >
              <Card
                sx={{
                  p: { xs: 2, sm: 3 },
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  "&:hover": { boxShadow: 4 },
                  cursor: "pointer",
                  height: "100%",
                  width: { xs: "150px", sm: "250px", md: "280px" },
                }}
                onClick={() => handleView(doc._id)}
              >
                <Typography
                  fontWeight="600"
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    wordBreak: "break-word",
                  }}
                >
                  {doc.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    color: "#6b4f2c",
                    borderColor: "#c7b299",
                    "&:hover": { backgroundColor: "#f4ede4" },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                  sx={{
                    textTransform: "none",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                    sx={{
                      textTransform: "none",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                    left: { xs: "50%", md: "120px" },
                    transform: { xs: "translateX(-50%)", md: "none" },
                    width: "200px",
                    height: "auto",
                    backgroundColor: "white",
                    padding: "8px",
                    boxShadow: 3,
                    borderRadius: "8px",
                    zIndex: 10,
                    display: { xs: "none", md: "block" },
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
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 2, sm: 3 },
            width: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
          {viewingDocument?.name}
        </DialogTitle>
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
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 2, sm: 3 },
            width: { xs: "calc(100% - 32px)", sm: "auto" },
          },
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this document?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 2, sm: 3 },
            width: { xs: "calc(100% - 32px)", sm: "auto" },
          },
        }}
      >
        <DialogTitle>Rename Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            margin="normal"
          />

          <DialogActions sx={{ px: 0 }}>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              sx={{ backgroundColor: "#6b4f2c" }}
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
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 2, sm: 3 },
            width: { xs: "calc(100% - 32px)", sm: "auto" },
          },
        }}
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Select a file to upload</Typography>
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
