import {
  User,
  AuthResponse,
  Train,
  Booking,
  SearchParams,
  BookingRequest,
  DashboardStats
} from "../types";

const API_BASE = "/api";

// Helper to get auth token
const getToken = (): string | null => localStorage.getItem("token");

// Helper for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
  }

  // Handle empty responses (204 No Content, etc.)
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text);
}

// Authentication APIs
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },
};

// Train APIs
export const trainApi = {
  searchTrains: async (params: SearchParams): Promise<Train[]> => {
    const searchParams = new URLSearchParams();
    if (params.source) searchParams.set("source", params.source);
    if (params.destination) searchParams.set("destination", params.destination);
    return apiRequest<Train[]>(`/trains/search?${searchParams.toString()}`);
  },

  getTrainById: async (id: string): Promise<Train | null> => {
    try {
      return await apiRequest<Train>(`/trains/${id}`);
    } catch {
      return null;
    }
  },

  getAllTrains: async (): Promise<Train[]> => {
    return apiRequest<Train[]>("/trains");
  },

  createTrain: async (train: Omit<Train, "id">): Promise<Train> => {
    return apiRequest<Train>("/trains", {
      method: "POST",
      body: JSON.stringify(train),
    });
  },

  updateTrain: async (id: string, train: Partial<Train>): Promise<Train> => {
    return apiRequest<Train>(`/trains/${id}`, {
      method: "PUT",
      body: JSON.stringify(train),
    });
  },

  deleteTrain: async (id: string): Promise<void> => {
    await apiRequest<void>(`/trains/${id}`, {
      method: "DELETE",
    });
  },
};

// Booking APIs
export const bookingApi = {
  createBooking: async (userId: string, request: BookingRequest): Promise<Booking> => {
    return apiRequest<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify({ ...request, userId }),
    });
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    return apiRequest<Booking[]>(`/bookings/user/${userId}`);
  },

  getAllBookings: async (): Promise<Booking[]> => {
    return apiRequest<Booking[]>("/bookings");
  },

  cancelBooking: async (bookingId: string, userId: string): Promise<Booking> => {
    return apiRequest<Booking>(`/bookings/${bookingId}/cancel?userId=${userId}`, {
      method: "PUT",
    });
  },
};

// Dashboard APIs
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>("/dashboard/stats");
  },
};
