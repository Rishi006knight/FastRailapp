export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Train {
  id: string;
  trainNumber: string;
  name: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  daysOfOperation: string[];
}

export interface Booking {
  id: string;
  userId: string;
  trainId: string;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  passengerName: string;
  passengerAge: number;
  seatNumber: string;
  bookingDate: string;
  travelDate: string;
  price: number;
  status: "CONFIRMED" | "CANCELLED";
}

export interface SearchParams {
  source: string;
  destination: string;
  date: string;
}

export interface BookingRequest {
  trainId: string;
  passengerName: string;
  passengerAge: number;
  travelDate: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  averageOccupancy: number;
  activeTrains: number;
  confirmedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
}
