import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, DollarSign, User, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CryptoPayment {
  id: string;
  order_id: string;
  customer_email: string;
  customer_name: string;
  amount: number;
  wallet_address: string;
  status: string;
  admin_notes: string | null;
  customer_info: any;
  cart_items: any;
  shipping_address: any;
  created_at: string;
  confirmed_at: string | null;
  confirmed_by: string | null;
}

export function CryptoPaymentsManager() {
  const [payments, setPayments] = useState<CryptoPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<CryptoPayment | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('crypto_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching crypto payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch crypto payments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: 'confirmed' | 'rejected', notes: string) => {
    try {
      const { data: paymentData, error: fetchError } = await supabase
        .from('crypto_payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('crypto_payments')
        .update({
          status,
          admin_notes: notes,
          confirmed_by: 'admin' // In a real app, this would be the admin's user ID
        })
        .eq('id', paymentId);

      if (error) throw error;

      // Send confirmation email if approved
      if (status === 'confirmed') {
        await supabase.functions.invoke('send-crypto-payment-emails', {
          body: {
            type: 'confirmed',
            customerName: paymentData.customer_name,
            customerEmail: paymentData.customer_email,
            orderId: paymentData.order_id,
            amount: paymentData.amount,
            walletAddress: paymentData.wallet_address
          }
        });
      }

      toast({
        title: "Success",
        description: `Payment ${status === 'confirmed' ? 'confirmed' : 'rejected'} successfully`,
      });

      fetchPayments(); // Refresh the list
      setSelectedPayment(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Confirmed</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading crypto payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Crypto Payment Verification</h2>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Pending: {payments.filter(p => p.status === 'pending').length}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Confirmed: {payments.filter(p => p.status === 'confirmed').length}
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{payment.order_id}</h3>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {payment.customer_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${payment.amount.toFixed(2)}
                    </span>
                    <span>
                      {new Date(payment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {payment.status === 'pending' && (
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setAdminNotes(payment.admin_notes || '');
                          }}
                        >
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Review Crypto Payment - {payment.order_id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Customer Information</h4>
                              <div className="text-sm space-y-1">
                                <p><strong>Name:</strong> {payment.customer_name}</p>
                                <p><strong>Email:</strong> {payment.customer_email}</p>
                                <p><strong>Amount:</strong> ${payment.amount.toFixed(2)}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Payment Details</h4>
                              <div className="text-sm space-y-1">
                                <p><strong>Wallet Address:</strong></p>
                                <p className="font-mono text-xs break-all bg-muted p-2 rounded">
                                  {payment.wallet_address}
                                </p>
                                <p><strong>Submitted:</strong> {new Date(payment.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Admin Notes</h4>
                            <Textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Add notes about this payment verification..."
                              rows={3}
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="destructive"
                              onClick={() => updatePaymentStatus(payment.id, 'rejected', adminNotes)}
                            >
                              Reject Payment
                            </Button>
                            <Button
                              onClick={() => updatePaymentStatus(payment.id, 'confirmed', adminNotes)}
                            >
                              Confirm Payment
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
              
              {payment.admin_notes && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm"><strong>Admin Notes:</strong> {payment.admin_notes}</p>
                </div>
              )}

              {payment.confirmed_at && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Confirmed on {new Date(payment.confirmed_at).toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {payments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Wallet className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No crypto payments yet</h3>
            <p className="text-muted-foreground">Crypto payment verification requests will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}