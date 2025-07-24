import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
  qr_code_url?: string;
  is_active: boolean;
}

interface CryptoWalletFormProps {
  wallet?: CryptoWallet | null;
  onSaved: () => void;
  onCancel: () => void;
}

const SUPPORTED_CURRENCIES = [
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'USDT', label: 'Tether (USDT)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
  { value: 'BNB', label: 'Binance Coin (BNB)' },
  { value: 'LTC', label: 'Litecoin (LTC)' },
  { value: 'DOGE', label: 'Dogecoin (DOGE)' },
];

export function CryptoWalletForm({ wallet, onSaved, onCancel }: CryptoWalletFormProps) {
  const [formData, setFormData] = useState({
    currency: wallet?.currency || '',
    wallet_address: wallet?.wallet_address || '',
    qr_code_url: wallet?.qr_code_url || '',
    is_active: wallet?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currency || !formData.wallet_address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (wallet) {
        // Update existing wallet
        const { error } = await supabase
          .from('crypto_wallets')
          .update({
            currency: formData.currency,
            wallet_address: formData.wallet_address,
            qr_code_url: formData.qr_code_url || null,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', wallet.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Crypto wallet updated successfully"
        });
      } else {
        // Create new wallet
        const { error } = await supabase
          .from('crypto_wallets')
          .insert([{
            currency: formData.currency,
            wallet_address: formData.wallet_address,
            qr_code_url: formData.qr_code_url || null,
            is_active: formData.is_active,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Crypto wallet created successfully"
        });
      }

      onSaved();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currency">Currency *</Label>
        <Select
          value={formData.currency}
          onValueChange={(value) => setFormData({ ...formData, currency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cryptocurrency" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_CURRENCIES.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wallet_address">Wallet Address *</Label>
        <Input
          id="wallet_address"
          type="text"
          value={formData.wallet_address}
          onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
          placeholder="Enter wallet address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="qr_code_url">QR Code URL (Optional)</Label>
        <Input
          id="qr_code_url"
          type="url"
          value={formData.qr_code_url}
          onChange={(e) => setFormData({ ...formData, qr_code_url: e.target.value })}
          placeholder="https://example.com/qr-code.png"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : wallet ? 'Update Wallet' : 'Create Wallet'}
        </Button>
      </div>
    </form>
  );
}