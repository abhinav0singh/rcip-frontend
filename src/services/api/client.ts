import { API_BASE_URL } from "@/constants/api";
import type { ApiError } from "@/types/api";

export class ApiClientError extends Error {
  code: string;
  status: number;

  constructor(error: ApiError, status: number) {
    super(error.message);
    this.code = error.code;
    this.status = status;
    this.name = "ApiClientError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let error: ApiError;
    try {
      error = await response.json();
    } catch {
      error = {
        code: "UNKNOWN_ERROR",
        message: `Request failed with status ${response.status}`,
      };
    }
    throw new ApiClientError(error, response.status);
  }
  return response.json() as Promise<T>;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number>,
  init?: RequestInit
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      url.searchParams.set(k, String(v));
    });
  }
  const response = await fetch(url.toString(), {
    ...init,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  return handleResponse<T>(response);
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
}
