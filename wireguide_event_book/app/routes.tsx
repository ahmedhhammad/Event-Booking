import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { HomePage } from "./components/pages/HomePage";
import { EventsListingPage } from "./components/pages/EventsListingPage";
import { EventDetailsPage } from "./components/pages/EventDetailsPage";
import { BookingCheckoutPage } from "./components/pages/BookingCheckoutPage";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { UserDashboard } from "./components/pages/UserDashboard";
import { AdminDashboard } from "./components/pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "events", Component: EventsListingPage },
      { path: "events/:id", Component: EventDetailsPage },
      { path: "booking/:id", Component: BookingCheckoutPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "dashboard", Component: UserDashboard },
      { path: "admin", Component: AdminDashboard },
    ],
  },
]);
