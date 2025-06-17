
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from "@/pages/Auth";
import { AdminRoutes } from "./AdminRoutes";
import { PublicRoutes } from "./PublicRoutes";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/auth" element={<Auth />} />

        {/* Admin Routes */}
        <AdminRoutes />

        {/* Public Routes with Header/Footer */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
