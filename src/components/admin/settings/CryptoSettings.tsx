import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wallet, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveToLocalStorage } from '@/utils/adminSettings';

interface CryptoSettingsType {
  walletAddress: string;
  qrCodeImage: string;
}

interface CryptoSettingsProps {
  cryptoSettings: CryptoSettingsType;
  setCryptoSettings: (settings: CryptoSettingsType) => void;
}

export function CryptoSettings({ cryptoSettings, setCryptoSettings }: CryptoSettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSaveCrypto = () => {
    saveToLocalStorage('cryptoSettings', cryptoSettings);
    toast({
      title: "Success",
      description: "Crypto payment settings saved successfully",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setCryptoSettings({
        ...cryptoSettings,
        qrCodeImage: base64String
      });
      setIsUploading(false);
      toast({
        title: "Success",
        description: "QR code image uploaded successfully",
      });
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    };

    reader.readAsDataURL(file);
  };

  const removeQRCode = () => {
    setCryptoSettings({
      ...cryptoSettings,
      qrCodeImage: ''
    });
    toast({
      title: "Success",
      description: "QR code image removed",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Cryptocurrency Payment Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="walletAddress">Wallet Address</Label>
          <Textarea
            id="walletAddress"
            placeholder="Enter your cryptocurrency wallet address"
            value={cryptoSettings.walletAddress}
            onChange={(e) => setCryptoSettings({
              ...cryptoSettings,
              walletAddress: e.target.value
            })}
            rows={3}
          />
          <p className="text-sm text-muted-foreground">
            Customers will send payments to this wallet address
          </p>
        </div>

        <div className="space-y-4">
          <Label>QR Code Image</Label>
          
          {cryptoSettings.qrCodeImage ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center p-4 border rounded-lg bg-white">
                <img 
                  src={cryptoSettings.qrCodeImage} 
                  alt="QR Code Preview" 
                  className="max-w-48 max-h-48"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('qr-upload')?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Replace QR Code
                </Button>
                <Button
                  variant="outline"
                  onClick={removeQRCode}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload a QR code image for your wallet
                </p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => document.getElementById('qr-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Choose Image'}
                </Button>
              </div>
            </div>
          )}

          <input
            id="qr-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          
          <p className="text-sm text-muted-foreground">
            Upload a QR code image that customers can scan to send payments
          </p>
        </div>

        <Button onClick={handleSaveCrypto} className="w-full">
          Save Crypto Settings
        </Button>
      </CardContent>
    </Card>
  );
}