import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { UserLayout } from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { BookingPage } from "./pages/BookingPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminTrainsPage } from "./pages/admin/AdminTrainsPage";
import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: LoginPage },
          { path: "register", Component: RegisterPage },
        ],
      },
      {
        path: "user",
        Component: UserLayout,
        children: [
          { index: true, Component: HomePage },
          { path: "search", Component: SearchResultsPage },
          { path: "book/:trainId", Component: BookingPage },
          { path: "bookings", Component: MyBookingsPage },
        ],
      },
      {
        path: "admin",
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboardPage },
          { path: "trains", Component: AdminTrainsPage },
          { path: "bookings", Component: AdminBookingsPage },
        ],
      },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
