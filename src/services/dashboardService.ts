const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const fetchWorkspaces = async (nid: string, token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/workspace/${nid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    throw error;
  }
};

export const createWorkspace = async (
  name: string,
  userNid: string,
  token: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/workspace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, userNid }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating workspace:", error);
    throw error;
  }
};

export const updateWorkspace = async (
  id: string,
  newName: string,
  token: string
) => {
  try {
    const response = await fetch(`${BASE_URL}/workspace/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating workspace:", error);
    throw error;
  }
};

export const deleteWorkspace = async (id: string, token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/workspace/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw error;
  }
};
