import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Providers
import { queryClient } from "@/lib/apiClient";
import { QueryClientProvider } from "@/lib/apiClient";
import { AuthProvider } from "@/features/auth/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
