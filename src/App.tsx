
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/providers/AppProviders";
import { AppRoutes } from "@/components/routing/AppRoutes";

function App() {
  return (
    <AppProviders>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
