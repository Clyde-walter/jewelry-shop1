
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ProfileUpdateData } from '@/types/auth';

class AuthService {
  async signUp(email: string, password: string, firstName?: string, lastName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    } 

    // Send welcome email
    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          email,
          firstName,
          lastName,
          confirmationUrl: data.user?.email_confirmed_at ? undefined : `${window.location.origin}/auth?verify=true`
        }
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail signup if email fails
    }

    if (data.user && !data.user.email_confirmed_at) {
      toast({
        title: "Welcome to Jewelry Port!",
        description: "Please check your email to verify your account.",
      });
      return { error: null, needsVerification: true };
    } else {
      toast({
        title: "Welcome to Jewelry Port!",
        description: "Your account has been created successfully.",
      });
      return { error: null, needsVerification: false };
    }
  }

  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back to Jewelry Port!",
        description: "You have successfully signed in.",
      });
    }

    return { error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out from Jewelry Port",
        description: "You have been successfully signed out.",
      });
    }
  }

  async resetPassword(email: string) {
    try {
      // Use the custom edge function instead of Supabase's built-in method
      const { data, error } = await supabase.functions.invoke('send-password-reset', {
        body: {
          email: email,
          redirectUrl: `${window.location.origin}/reset-password`
        }
      });

      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      if (!data.success) {
        console.error('Password reset failed:', data.error);
        toast({
          title: "Password reset failed",
          description: data.error || "Failed to send reset code. Please try again.",
          variant: "destructive"
        });
        return { error: new Error(data.error) };
      }

      toast({
        title: "Reset code sent",
        description: "Please check your email (including spam folder) for the verification code.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Password reset failed",
        description: error.message || "Failed to send reset code. Please try again.",
        variant: "destructive"
      });
      return { error };
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          redirectUrl: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Verification email error:', error);
        toast({
          title: "Verification email failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      if (!data.success) {
        console.error('Verification email failed:', data.error);
        toast({
          title: "Verification email failed",
          description: data.error || "Failed to send verification email. Please try again.",
          variant: "destructive"
        });
        return { error: new Error(data.error) };
      }

      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Verification email error:', error);
      toast({
        title: "Verification email failed",
        description: error.message || "Failed to send verification email. Please try again.",
        variant: "destructive"
      });
      return { error };
    }
  }

  async updateProfile(userId: string, data: ProfileUpdateData) {
    const { error } = await supabase
      .from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your Jewelry Port profile has been successfully updated.",
      });
    }

    return { error };
  }
}

export const authService = new AuthService();
