/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const registerUser = async (values: any) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

export const loginUser = async (values: any) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};
