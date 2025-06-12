import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { StoreProvider } from '@/contexts/StoreContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Index } from '@/pages/Index';
import { Home } from '@/pages/Home';
import { Products } from '@/pages/Products';
import { ProductDetail } from '@/pages/ProductDetail';
import { Collections } from '@/pages/Collections';
import { CollectionDetail } from '@/pages/CollectionDetail';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Wishlist } from '@/pages/Wishlist';
import { Profile } from '@/pages/Profile';
import { ProfileSettings } from '@/pages/ProfileSettings';
import { Orders } from '@/pages/Orders';
import { ManageAddresses } from '@/pages/ManageAddresses';
import { PaymentMethods } from '@/pages/PaymentMethods';
import { CustomDesign } from '@/pages/CustomDesign';
import { AuthGuard } from '@/components/AuthGuard';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminOrders } from '@/pages/admin/AdminOrders';
import { AdminCollections } from '@/pages/admin/AdminCollections';
import { LiveMap } from '@/pages/LiveMap';
import { Auth } from '@/pages/Auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <StoreProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/collections" element={<Collections />} />
                      <Route path="/collection/:id" element={<CollectionDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/settings" element={<ProfileSettings />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/manage-addresses" element={<ManageAddresses />} />
                      <Route path="/payment-methods" element={<PaymentMethods />} />
                      <Route path="/custom-design" element={<CustomDesign />} />
                      <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
                      <Route path="/admin/products" element={<AuthGuard><AdminProducts /></AuthGuard>} />
                      <Route path="/admin/orders" element={<AuthGuard><AdminOrders /></AuthGuard>} />
                      <Route path="/admin/collections" element={<AuthGuard><AdminCollections /></AuthGuard>} />
                      <Route path="/livemap/:orderId" element={<LiveMap />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </StoreProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
