
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<{ error: any; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (
    data: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      date_of_birth?: string;
      profile_image_url?: string;
      newsletter?: boolean;
      sms_notifications?: boolean;
      email_notifications?: boolean;
    }
  ) => Promise<{ error: any }>;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  profile_image_url?: string;
  newsletter?: boolean;
  sms_notifications?: boolean;
  email_notifications?: boolean;
}
