
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { validateEmail, validatePassword } from '@/components/security/InputSanitizer';

interface AuthAttempt {
  timestamp: number;
  success: boolean;
  ip?: string;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10;

export function useSecureAuth() {
  const { signIn, signUp } = useAuth();
  const [attempts, setAttempts] = useState<AuthAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    
    // Clean up old attempts
    const recentAttempts = attempts.filter(
      attempt => now - attempt.timestamp < LOCKOUT_DURATION
    );
    
    if (recentAttempts.length !== attempts.length) {
      setAttempts(recentAttempts);
    }

    // Check if account is locked
    const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
    setIsLocked(failedAttempts.length >= MAX_ATTEMPTS);

    // Check rate limiting
    const recentRequests = recentAttempts.filter(
      attempt => now - attempt.timestamp < RATE_LIMIT_WINDOW
    );
    
    if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
      setRateLimitedUntil(now + RATE_LIMIT_WINDOW);
    } else if (rateLimitedUntil && now > rateLimitedUntil) {
      setRateLimitedUntil(null);
    }
  }, [attempts, rateLimitedUntil]);

  const secureSignIn = async (email: string, password: string) => {
    const now = Date.now();
    
    // Check rate limiting
    if (rateLimitedUntil && now < rateLimitedUntil) {
      toast({
        title: "Too many requests",
        description: "Please wait before trying again.",
        variant: "destructive"
      });
      return { error: new Error('Rate limited') };
    }

    // Check account lockout
    if (isLocked) {
      toast({
        title: "Account temporarily locked",
        description: "Too many failed login attempts. Please try again in 15 minutes.",
        variant: "destructive"
      });
      return { error: new Error('Account locked') };
    }

    // Validate input
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return { error: new Error('Invalid email') };
    }

    if (!password || password.length < 8) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return { error: new Error('Invalid password') };
    }

    const result = await signIn(email, password);
    
    // Record attempt
    setAttempts(prev => [...prev, {
      timestamp: now,
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
    } else {
      // Clear attempts on successful login
      setAttempts([]);
      setIsLocked(false);
      setRateLimitedUntil(null);
    }

    return result;
  };

  const secureSignUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const now = Date.now();
    
    // Check rate limiting
    if (rateLimitedUntil && now < rateLimitedUntil) {
      toast({
        title: "Too many requests",
        description: "Please wait before trying again.",
        variant: "destructive"
      });
      return { error: new Error('Rate limited') };
    }

    // Validate email
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return { error: new Error('Invalid email') };
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Password requirements not met",
        description: passwordValidation.errors.join(', '),
        variant: "destructive"
      });
      return { error: new Error('Password too weak') };
    }

    const result = await signUp(email, password, firstName, lastName);
    
    // Record attempt
    setAttempts(prev => [...prev, {
      timestamp: now,
      success: !result.error
    }]);

    return result;
  };

  return {
    secureSignIn,
    secureSignUp,
    isLocked,
    isRateLimited: rateLimitedUntil ? Date.now() < rateLimitedUntil : false,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - attempts.filter(a => !a.success).length)
  };
}
