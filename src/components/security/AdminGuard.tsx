
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'super_admin';
}

export function AdminGuard({ children, requiredRole = 'admin' }: AdminGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const [sessionValid, setSessionValid] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Session timeout (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  useEffect(() => {
    // Check session validity
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setSessionValid(false);
      }
    };

    checkSession();

    // Set up activity monitoring
    const updateActivity = () => setLastActivity(Date.now());
    
    document.addEventListener('mousedown', updateActivity);
    document.addEventListener('keydown', updateActivity);
    document.addEventListener('scroll', updateActivity);

    // Check for session timeout
    const timeoutInterval = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        setSessionValid(false);
        supabase.auth.signOut();
      }
    }, 60000); // Check every minute

    return () => {
      document.removeEventListener('mousedown', updateActivity);
      document.removeEventListener('keydown', updateActivity);
      document.removeEventListener('scroll', updateActivity);
      clearInterval(timeoutInterval);
    };
  }, [lastActivity]);

  // Log admin access attempts
  useEffect(() => {
    if (user && isAdmin) {
      console.log(`[SECURITY] Admin access granted to user: ${user.email} at ${new Date().toISOString()}`);
    } else if (user && !isAdmin && !adminLoading) {
      console.warn(`[SECURITY] Unauthorized admin access attempt by user: ${user.email} at ${new Date().toISOString()}`);
    }
  }, [user, isAdmin, adminLoading]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!user || !sessionValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              {!user ? 'Please sign in to access admin features.' : 'Your session has expired.'}
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You don't have permission to access this area.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
