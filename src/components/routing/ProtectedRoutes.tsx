
import React from 'react';
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Checkout } from "@/pages/Checkout";
import { Orders } from "@/pages/Orders";
import { Profile } from "@/pages/Profile";
import { ProfileSettings } from "@/pages/ProfileSettings";
import { Wishlist } from "@/pages/Wishlist";
import { LiveMap } from "@/pages/LiveMap";
import { ManageAddresses } from "@/pages/ManageAddresses";
import { PaymentMethods } from "@/pages/PaymentMethods";
import { EditInformation } from "@/pages/EditInformation";

export function ProtectedRoutes() {
  return (
    <>
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/orders/:orderId" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/profile/settings" element={
        <ProtectedRoute>
          <ProfileSettings />
        </ProtectedRoute>
      } />
      <Route path="/wishlist" element={
        <ProtectedRoute>
          <Wishlist />
        </ProtectedRoute>
      } />
      <Route path="/live-map" element={
        <ProtectedRoute>
          <LiveMap />
        </ProtectedRoute>
      } />
      <Route path="/manage-addresses" element={
        <ProtectedRoute>
          <ManageAddresses />
        </ProtectedRoute>
      } />
      <Route path="/payment-methods" element={
        <ProtectedRoute>
          <PaymentMethods />
        </ProtectedRoute>
      } />
      <Route path="/edit-information" element={
        <ProtectedRoute>
          <EditInformation />
        </ProtectedRoute>
      } />
    </>
  );
}
