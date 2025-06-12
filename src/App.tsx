
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/contexts/StoreContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Home } from "@/pages/Home";
import { Products } from "@/pages/Products";
import { Collections } from "@/pages/Collections";
import { CollectionDetail } from "@/pages/CollectionDetail";
import { ProductDetail } from "@/pages/ProductDetail";
import { CustomDesign } from "@/pages/CustomDesign";
import { Checkout } from "@/pages/Checkout";
import { Orders } from "@/pages/Orders";
import { Admin } from "@/pages/Admin";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminCollections } from "@/pages/admin/AdminCollections";
import { AdminCustomers } from "@/pages/admin/AdminCustomers";
import { AdminSupport } from "@/pages/admin/AdminSupport";
import { AdminShipping } from "@/pages/admin/AdminShipping";
import { AdminAnalytics } from "@/pages/admin/AdminAnalytics";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { AdminEmails } from "@/pages/admin/AdminEmails";
import { Cart } from "@/pages/Cart";
import { Profile } from "@/pages/Profile";
import { Wishlist } from "@/pages/Wishlist";
import { ProfileSettings } from "@/pages/ProfileSettings";
import { LiveMap } from "@/pages/LiveMap";
import { ManageAddresses } from "@/pages/ManageAddresses";
import { PaymentMethods } from "@/pages/PaymentMethods";
import { EditInformation } from "@/pages/EditInformation";
import { Contact } from "@/pages/Contact";
import { Support } from "@/pages/Support";
import { Returns } from "@/pages/Returns";
import { Warranty } from "@/pages/Warranty";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { Cookies } from "@/pages/Cookies";
import { Notifications } from "@/pages/Notifications";
import { Chat } from "@/pages/Chat";
import NotFound from "./pages/NotFound";
import { CustomerCareButton } from "@/components/CustomerCareButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Admin />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="collections" element={<AdminCollections />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="shipping" element={<AdminShipping />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="emails" element={<AdminEmails />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Public Routes with Header/Footer */}
            <Route path="/*" element={
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/collection/:id" element={<CollectionDetail />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/custom-design" element={<CustomDesign />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:orderId" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/settings" element={<ProfileSettings />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/live-map" element={<LiveMap />} />
                    <Route path="/manage-addresses" element={<ManageAddresses />} />
                    <Route path="/payment-methods" element={<PaymentMethods />} />
                    <Route path="/edit-information" element={<EditInformation />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/warranty" element={<Warranty />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <CustomerCareButton />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
