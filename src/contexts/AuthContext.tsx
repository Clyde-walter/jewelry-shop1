
import React, { createContext, useContext } from 'react';
import { AuthContextType, ProfileUpdateData } from '@/types/auth';
import { authService } from '@/services/authService';
import { useAuthState } from '@/hooks/useAuthState';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, session, loading } = useAuthState();

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    return authService.signUp(email, password, firstName, lastName);
  };

  const signIn = async (email: string, password: string) => {
    return authService.signIn(email, password);
  };

  const signOut = async () => {
    return authService.signOut();
  };

  const resetPassword = async (email: string) => {
    return authService.resetPassword(email);
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user) return { error: new Error('No user logged in') };
    return authService.updateProfile(user.id, data);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
