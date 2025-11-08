const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const fetchDocuments = async (
  token: string,
  workspaceId: string,
  typeFilter?: string,
  sortBy?: string
) => {
  let url = `${BASE_URL}/documents/workspace/${workspaceId}`;
  const params = new URLSearchParams();
  if (typeFilter) params.append("type", typeFilter);
  if (sortBy) params.append("sort", sortBy);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const fetchPreview = async (token: string, docId: string) => {
  const res = await fetch(`${BASE_URL}/documents/${docId}/preview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const uploadDocument = async (
  token: string,
  file: File,
  workspaceId: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("workspaceId", workspaceId);

  const res = await fetch(`${BASE_URL}/documents/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
};

export const deleteDocument = async (token: string, docId: string) => {
  const res = await fetch(`${BASE_URL}/documents/${docId}/soft-delete`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const updateDocument = async (
  token: string,
  docId: string,
  newName: string
) => {
  const res = await fetch(`${BASE_URL}/documents/${docId}/metadata`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: newName }),
  });
  return res.json();
};

export const viewDocument = async (token: string, docId: string) => {
  const res = await fetch(`${BASE_URL}/documents/${docId}/view`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const downloadDocument = async (
  token: string,
  docId: string,
  filename: string
) => {
  const res = await fetch(`${BASE_URL}/documents/${docId}/download`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Download failed");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const searchDocuments = async (
  token: string,
  workspaceId: string,
  query: string
) => {
  const res = await fetch(
    `${BASE_URL}/documents/search?workspaceId=${workspaceId}&query=${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.json();
};
