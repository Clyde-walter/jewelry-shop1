import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CryptoWalletForm } from '@/components/admin/CryptoWalletForm';
import { CryptoWalletsTable } from '@/components/admin/CryptoWalletsTable';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
  qr_code_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function AdminCryptoWallets() {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<CryptoWallet | null>(null);

  const fetchWallets = async () => {
    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching wallets",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleWalletSaved = () => {
    fetchWallets();
    setIsFormOpen(false);
    setEditingWallet(null);
  };

  const handleEdit = (wallet: CryptoWallet) => {
    setEditingWallet(wallet);
    setIsFormOpen(true);
  };

  const handleDelete = async (walletId: string) => {
    try {
      const { error } = await supabase
        .from('crypto_wallets')
        .delete()
        .eq('id', walletId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crypto wallet deleted successfully"
      });
      
      fetchWallets();
    } catch (error: any) {
      toast({
        title: "Error deleting wallet",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Crypto Wallets</h1>
          <p className="text-muted-foreground">Manage cryptocurrency wallet addresses for payments</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingWallet(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingWallet ? 'Edit Crypto Wallet' : 'Add New Crypto Wallet'}
              </DialogTitle>
            </DialogHeader>
            <CryptoWalletForm
              wallet={editingWallet}
              onSaved={handleWalletSaved}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <CryptoWalletsTable
            wallets={wallets}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}