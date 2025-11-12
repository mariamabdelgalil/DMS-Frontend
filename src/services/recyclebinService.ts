const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const fetchDeletedDocuments = async (token: string) => {
  try {
    const res = await fetch(`${BASE_URL}/documents/deleted/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching deleted docs:", err);
    throw err;
  }
};

export const restoreDocument = async (id: string, token: string) => {
  try {
    const res = await fetch(`${BASE_URL}/documents/${id}/restore`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error restoring doc:", err);
    throw err;
  }
};

export const permanentlyDeleteDocument = async (id: string, token: string) => {
  try {
    const res = await fetch(`${BASE_URL}/documents/${id}/permanent-delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error permanently deleting doc:", err);
    throw err;
  }
};
