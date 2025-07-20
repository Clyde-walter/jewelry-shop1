import React from 'react';
import { CryptoPaymentsManager } from '@/components/admin/CryptoPaymentsManager';

export function AdminCryptoPayments() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crypto Payment Verifications</h1>
        <p className="text-gray-600 mt-2">Manage and verify cryptocurrency payments from customers</p>
      </div>
      
      <CryptoPaymentsManager />
    </div>
  );
}