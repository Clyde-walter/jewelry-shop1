
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from "@/pages/Auth";
import { OTPVerification } from "@/pages/OTPVerification";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { ResetPassword } from "@/pages/ResetPassword";
import { ResetPasswordOTP } from "@/pages/ResetPasswordOTP";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Admin from "@/pages/Admin";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminCustomers } from "@/pages/admin/AdminCustomers";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminCollections } from "@/pages/admin/AdminCollections";
import { AdminCollectionProducts } from "@/pages/admin/AdminCollectionProducts";
import { AdminSupport } from "@/pages/admin/AdminSupport";
import { AdminShipping } from "@/pages/admin/AdminShipping";
import { AdminAnalytics } from "@/pages/admin/AdminAnalytics";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { AdminEmails } from "@/pages/admin/AdminEmails";
import { AdminWarranty } from "@/pages/admin/AdminWarranty";
import { AdminContact } from "@/pages/admin/AdminContact";
import { AdminReturns } from "@/pages/admin/AdminReturns";
import { AdminFeatured } from "@/pages/admin/AdminFeatured";

import { PublicRoutes } from "./PublicRoutes";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password-otp" element={<ResetPasswordOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route index element={<Admin />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="collections" element={<AdminCollections />} />
              <Route path="collections/:collectionId/products" element={<AdminCollectionProducts />} />
              <Route path="featured" element={<AdminFeatured />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="warranty" element={<AdminWarranty />} />
              <Route path="contact" element={<AdminContact />} />
              <Route path="returns" element={<AdminReturns />} />
              <Route path="shipping" element={<AdminShipping />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="emails" element={<AdminEmails />} />
              
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </AdminLayout>
        } />

        {/* Public Routes with Header/Footer */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
