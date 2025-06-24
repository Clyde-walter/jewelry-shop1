
import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { sanitizeInput, validateEmail, validatePassword } from '@/components/security/InputSanitizer';

interface SecureAuthFormProps {
  isLogin: boolean;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export function SecureAuthForm({ isLogin, onSubmit, loading }: SecureAuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailError, setEmailError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));

    // Real-time validation
    if (field === 'email') {
      setEmailError(validateEmail(sanitizedValue) ? '' : 'Please enter a valid email address');
    }
    
    if (field === 'password' && !isLogin) {
      const validation = validatePassword(sanitizedValue);
      setPasswordErrors(validation.errors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!isLogin) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setPasswordErrors(passwordValidation.errors);
        return;
      }
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required={!isLogin}
              maxLength={50}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required={!isLogin}
              maxLength={50}
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="your@email.com"
          required
          maxLength={100}
        />
        {emailError && (
          <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {emailError}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••"
            required
            maxLength={128}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        
        {!isLogin && passwordErrors.length > 0 && (
          <div className="mt-2 space-y-1">
            {passwordErrors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            ))}
          </div>
        )}
        
        {!isLogin && formData.password && passwordErrors.length === 0 && (
          <div className="flex items-center gap-2 mt-1 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            Password meets security requirements
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-ecommerce-600 hover:bg-ecommerce-700 text-white"
        disabled={loading || (!!emailError) || (!isLogin && passwordErrors.length > 0)}
      >
        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
      </Button>
    </form>
  );
}
