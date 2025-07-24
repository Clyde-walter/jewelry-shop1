import React from 'react';
import { Edit, Trash2, Copy, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

interface CryptoWalletsTableProps {
  wallets: CryptoWallet[];
  loading: boolean;
  onEdit: (wallet: CryptoWallet) => void;
  onDelete: (walletId: string) => void;
}

export function CryptoWalletsTable({ wallets, loading, onEdit, onDelete }: CryptoWalletsTableProps) {
  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy address",
        variant: "destructive"
      });
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-10)}`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Loading wallets...</div>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">No crypto wallets found</div>
        <p className="text-sm text-muted-foreground mt-2">
          Add your first crypto wallet to start accepting cryptocurrency payments
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Currency</TableHead>
          <TableHead>Wallet Address</TableHead>
          <TableHead>QR Code</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {wallets.map((wallet) => (
          <TableRow key={wallet.id}>
            <TableCell className="font-medium">
              <Badge variant="outline">{wallet.currency}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">
                  {truncateAddress(wallet.wallet_address)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyAddress(wallet.wallet_address)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
            <TableCell>
              {wallet.qr_code_url ? (
                <Badge variant="secondary">
                  <QrCode className="w-3 h-3 mr-1" />
                  Available
                </Badge>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant={wallet.is_active ? "default" : "secondary"}>
                {wallet.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(wallet.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(wallet)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(wallet.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}