
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gem, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (!error) {
        // Redirect to OTP verification for password reset
        navigate(`/reset-password-otp?email=${encodeURIComponent(email)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Gem className="w-8 h-8 text-ecommerce-600" />
            <span className="text-3xl font-serif font-bold text-ecommerce-600">Jewelry Port</span>
          </Link>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="your@email.com"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-ecommerce-600 hover:bg-ecommerce-700 text-white"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <Link
                to="/auth"
                className="text-ecommerce-600 hover:text-ecommerce-700 font-medium inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>

            <div className="text-center mt-4">
              <Link 
                to="/" 
                className="text-sm text-gray-600 hover:text-ecommerce-600"
              >
                ← Back to store
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
