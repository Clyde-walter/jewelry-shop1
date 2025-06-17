
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { CollectionsProvider } from "@/contexts/CollectionsContext";
import { EmailProvider } from "@/contexts/EmailContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CustomersProvider } from "@/contexts/CustomersContext";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationsProvider>
            <LanguageProvider>
              <CartProvider>
                <WishlistProvider>
                  <ProductsProvider>
                    <CollectionsProvider>
                      <EmailProvider>
                        <CustomersProvider>
                          <OrdersProvider>
                            <StoreProvider>
                              {children}
                            </StoreProvider>
                          </OrdersProvider>
                        </CustomersProvider>
                      </EmailProvider>
                    </CollectionsProvider>
                  </ProductsProvider>
                </WishlistProvider>
              </CartProvider>
            </LanguageProvider>
          </NotificationsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
