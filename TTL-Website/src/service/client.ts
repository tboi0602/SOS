/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiOptions {
  method?: string;
  body?: unknown;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem("auth_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function request<T>(
  path: string,
  { method = "GET", body }: ApiOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...getAuthHeaders(),
  };
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server error");
  }

  if (!res.ok) {
    throw new Error(data.error || "Đã xảy ra lỗi");
  }

  return data as T;
}

export async function uploadFiles<T>(
  path: string,
  files: File[],
  fieldName = "files",
): Promise<T> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(fieldName, file);
  });
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload thất bại");
  return data as T;
}

export async function uploadSingleFile<T>(
  path: string,
  file: File,
  fieldName = "avatar",
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload thất bại");
  return data as T;
}
