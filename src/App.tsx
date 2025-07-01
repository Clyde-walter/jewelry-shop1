
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { CustomersProvider } from "@/contexts/CustomersContext";
import { SupportProvider } from "@/contexts/SupportContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppRoutes } from "@/components/routing/AppRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationsProvider>
            <LanguageProvider>
              <ProductsProvider>
                <CartProvider>
                  <WishlistProvider>
                    <OrdersProvider>
                      <CustomersProvider>
                        <SupportProvider>
                          <StoreProvider>
                            <AppRoutes />
                          </StoreProvider>
                        </SupportProvider>
                      </CustomersProvider>
                    </OrdersProvider>
                  </WishlistProvider>
                </CartProvider>
              </ProductsProvider>
            </LanguageProvider>
          </NotificationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
