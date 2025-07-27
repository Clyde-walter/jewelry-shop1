
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { AdvertBanner } from "@/components/AdvertBanner";
import { Footer } from "@/components/Footer";
import { CustomerCareButton } from "@/components/CustomerCareButton";
import { Home } from "@/pages/Home";
import { Products } from "@/pages/Products";
import { ProductDetail } from "@/pages/ProductDetail";
import { Collections } from "@/pages/Collections";
import { CollectionDetail } from "@/pages/CollectionDetail";
import { CustomDesign } from "@/pages/CustomDesign";
import { Cart } from "@/pages/Cart";
import { Contact } from "@/pages/Contact";
import { Support } from "@/pages/Support";
import { Returns } from "@/pages/Returns";
import { Warranty } from "@/pages/Warranty";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { Cookies } from "@/pages/Cookies";
import { Notifications } from "@/pages/Notifications";
import { Chat } from "@/pages/Chat";
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
import { FlutterwaveCheckout } from "@/pages/FlutterwaveCheckout";
import CPTCheckout from "@/pages/CPTCheckout";
import NotFound from "@/pages/NotFound";

export function PublicRoutes() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <AdvertBanner />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/:id/:collectionId" element={<ProductDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collection/:id" element={<CollectionDetail />} />
          <Route path="/custom-design" element={<CustomDesign />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chat" element={<Chat />} />
          
          {/* Protected Routes - Inlined */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/flutterwave-checkout" element={
            <ProtectedRoute>
              <FlutterwaveCheckout />
            </ProtectedRoute>
          } />
          <Route path="/cpt-checkout" element={
            <ProtectedRoute>
              <CPTCheckout />
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CustomerCareButton />
    </div>
  );
}
