
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AuthAttempt {
  timestamp: number;
  success: boolean;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function useSecureAuth() {
  const { signIn, signUp } = useAuth();
  const [attempts, setAttempts] = useState<AuthAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Clean up old attempts
    const now = Date.now();
    const recentAttempts = attempts.filter(
      attempt => now - attempt.timestamp < LOCKOUT_DURATION
    );
    
    if (recentAttempts.length !== attempts.length) {
      setAttempts(recentAttempts);
    }

    // Check if account is locked
    const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
    setIsLocked(failedAttempts.length >= MAX_ATTEMPTS);
  }, [attempts]);

  const secureSignIn = async (email: string, password: string) => {
    if (isLocked) {
      toast({
        title: "Account temporarily locked",
        description: "Too many failed login attempts. Please try again in 15 minutes.",
        variant: "destructive"
      });
      return { error: new Error('Account locked') };
    }

    const result = await signIn(email, password);
    
    // Record attempt
    setAttempts(prev => [...prev, {
      timestamp: Date.now(),
      success: !result.error
    }]);

    if (result.error) {
      const failedCount = attempts.filter(a => !a.success).length + 1;
      const remaining = MAX_ATTEMPTS - failedCount;
      
      if (remaining > 0) {
        toast({
          title: "Login failed",
          description: `Invalid credentials. ${remaining} attempts remaining.`,
          variant: "destructive"
        });
      }
    }

    return result;
  };

  const secureSignUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    // Additional validation for signup
    if (password.length < 8) {
      toast({
        title: "Password too weak",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return { error: new Error('Password too weak') };
    }

    return await signUp(email, password, firstName, lastName);
  };

  return {
    secureSignIn,
    secureSignUp,
    isLocked,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - attempts.filter(a => !a.success).length)
  };
}
