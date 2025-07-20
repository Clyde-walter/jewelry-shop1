
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from '@/components/admin/settings/GeneralSettings';
import { PaymentSettings } from '@/components/admin/settings/PaymentSettings';
import { NotificationSettings } from '@/components/admin/settings/NotificationSettings';
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings';
import { IntegrationSettings } from '@/components/admin/settings/IntegrationSettings';
import { CryptoSettings } from '@/components/admin/settings/CryptoSettings';
import { CryptoPaymentsManager } from '@/components/admin/CryptoPaymentsManager';
import { getFromLocalStorage } from '@/utils/adminSettings';

export function AdminSettings() {
  // Store settings state
  const [storeSettings, setStoreSettings] = useState(() => 
    getFromLocalStorage('storeSettings', {
      storeName: 'ShopEase',
      storeDescription: 'Premium fashion and lifestyle products',
      storeEmail: 'admin@shopease.com',
      storePhone: '+1 (555) 123-4567',
      currency: 'USD',
      timezone: 'America/New_York',
      taxRate: 8.5
    })
  );

  // Payment settings state - only Flutterwave now
  const [paymentSettings, setPaymentSettings] = useState(() =>
    getFromLocalStorage('paymentSettings', {
      flutterwaveEnabled: true,
      flutterwavePublicKey: '',
      flutterwaveSecretKey: ''
    })
  );
  

  // Notification settings state
  const [notifications, setNotifications] = useState(() =>
    getFromLocalStorage('notificationSettings', {
      newOrders: true,
      lowStock: true,
      customerReviews: true,
      marketingUpdates: false
    })
  );

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState(() =>
    getFromLocalStorage('securitySettings', {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: false
    })
  );

  // Crypto settings state
  const [cryptoSettings, setCryptoSettings] = useState(() =>
    getFromLocalStorage('cryptoSettings', {
      walletAddress: '',
      qrCodeImage: ''
    })
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Configure your store settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="crypto-payments">Crypto Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings 
            storeSettings={storeSettings}
            setStoreSettings={setStoreSettings}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentSettings 
            paymentSettings={paymentSettings}
            setPaymentSettings={setPaymentSettings}
          />
        </TabsContent>

        <TabsContent value="crypto">
          <CryptoSettings 
            cryptoSettings={cryptoSettings}
            setCryptoSettings={setCryptoSettings}
          />
        </TabsContent>

        <TabsContent value="crypto-payments">
          <CryptoPaymentsManager />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings 
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings 
            securitySettings={securitySettings}
            setSecuritySettings={setSecuritySettings}
          />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
