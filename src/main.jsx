import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./providers/ThemeProvider";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import useAuth from "./hooks/useAuth";
import Loading from "./components/Loading";
import App from "./pages/App";

const queryClient = new QueryClient();

const ConditionalRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <App /> : <Login />;
};

// Define Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <ConditionalRoute />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </QueryClientProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
