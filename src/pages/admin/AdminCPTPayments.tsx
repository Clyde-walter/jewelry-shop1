import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Check, X, Save } from 'lucide-react';

interface PaymentSettings {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  sort_code: string;
  btc_address: string;
  usdt_address: string;
}

interface PaymentConfirmation {
  id: string;
  order_id: string;
  payment_method: string;
  screenshot_url: string;
  notes: string;
  status: string;
  created_at: string;
  order?: {
    order_number: string;
    customer_info: any;
  };
}

export default function AdminCPTPayments() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [confirmations, setConfirmations] = useState<PaymentConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
    fetchConfirmations();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const defaultSettings = {
          bank_name: 'First Bank Nigeria',
          account_name: 'YourStore Limited',
          account_number: '2034567890',
          sort_code: '011-234-567',
          btc_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          usdt_address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('payment_settings')
          .insert(defaultSettings)
          .select()
          .single();
          
        if (insertError) throw insertError;
        setSettings(newData);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load payment settings",
        variant: "destructive"
      });
    }
  };

  const fetchConfirmations = async () => {
    try {
      const { data, error } = await supabase
        .from('cpt_payment_confirmations')
        .select(`
          *,
          order:orders(order_number, customer_info)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfirmations(data || []);
    } catch (error) {
      console.error('Error fetching confirmations:', error);
      toast({
        title: "Error",
        description: "Failed to load payment confirmations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('payment_settings')
        .update({
          bank_name: settings.bank_name,
          account_name: settings.account_name,
          account_number: settings.account_number,
          sort_code: settings.sort_code,
          btc_address: settings.btc_address,
          usdt_address: settings.usdt_address
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save payment settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfirmationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('cpt_payment_confirmations')
        .update({ 
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;

      setConfirmations(confirmations.map(conf => 
        conf.id === id ? { ...conf, status } : conf
      ));

      toast({
        title: "Success",
        description: `Payment confirmation ${status}`
      });
    } catch (error) {
      console.error('Error updating confirmation:', error);
      toast({
        title: "Error",
        description: "Failed to update confirmation status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CPT Payment Management</h1>
        <p className="text-muted-foreground">Manage bank details, crypto addresses and payment confirmations</p>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
          <TabsTrigger value="confirmations">Payment Confirmations</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings && (
                <>
                  {/* Bank Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Bank Transfer Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bank_name">Bank Name</Label>
                        <Input
                          id="bank_name"
                          value={settings.bank_name}
                          onChange={(e) => setSettings({...settings, bank_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account_name">Account Name</Label>
                        <Input
                          id="account_name"
                          value={settings.account_name}
                          onChange={(e) => setSettings({...settings, account_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account_number">Account Number</Label>
                        <Input
                          id="account_number"
                          value={settings.account_number}
                          onChange={(e) => setSettings({...settings, account_number: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sort_code">Sort Code</Label>
                        <Input
                          id="sort_code"
                          value={settings.sort_code}
                          onChange={(e) => setSettings({...settings, sort_code: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Crypto Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Cryptocurrency Addresses</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="btc_address">Bitcoin (BTC) Address</Label>
                        <Input
                          id="btc_address"
                          value={settings.btc_address}
                          onChange={(e) => setSettings({...settings, btc_address: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="usdt_address">Tether (USDT) Address</Label>
                        <Input
                          id="usdt_address"
                          value={settings.usdt_address}
                          onChange={(e) => setSettings({...settings, usdt_address: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={saveSettings} disabled={saving} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmations">
          <Card>
            <CardHeader>
              <CardTitle>Payment Confirmations</CardTitle>
            </CardHeader>
            <CardContent>
              {confirmations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No payment confirmations yet</p>
              ) : (
                <div className="space-y-4">
                  {confirmations.map((confirmation) => (
                    <div key={confirmation.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-semibold">
                            Order: {confirmation.order?.order_number || confirmation.order_id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Customer: {confirmation.order?.customer_info?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Method: {confirmation.payment_method === 'bank-transfer' ? 'Bank Transfer' : 'Cryptocurrency'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {new Date(confirmation.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(confirmation.status)}>
                          {confirmation.status}
                        </Badge>
                      </div>

                      {confirmation.notes && (
                        <div className="bg-muted p-3 rounded">
                          <p className="text-sm"><strong>Notes:</strong> {confirmation.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(confirmation.screenshot_url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Screenshot
                        </Button>
                        
                        {confirmation.status === 'pending' && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => updateConfirmationStatus(confirmation.id, 'confirmed')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => updateConfirmationStatus(confirmation.id, 'rejected')}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}