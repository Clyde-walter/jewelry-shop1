
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface SupportRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_response?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

interface SupportContextType {
  supportRequests: SupportRequest[];
  createSupportRequest: (request: Omit<SupportRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSupportRequest: (id: string, updates: Partial<SupportRequest>) => Promise<void>;
  deleteSupportRequest: (id: string) => Promise<void>;
  loading: boolean;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export function SupportProvider({ children }: { children: React.ReactNode }) {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSupportRequests = async () => {
    try {
      if (!user) {
        setSupportRequests([]);
        setLoading(false);
        return;
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      const isAdmin = roleData && roleData.length > 0;

      let query = supabase
        .from('support_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // If not admin, only show user's own requests
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching support requests:', error);
        toast({
          title: "Error loading support requests",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setSupportRequests(data || []);
    } catch (error) {
      console.error('Error in fetchSupportRequests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportRequests();

    // Set up real-time subscription
    const channel = supabase
      .channel('support-requests-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'support_requests' }, 
        () => {
          console.log('Support requests table changed, refetching...');
          fetchSupportRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createSupportRequest = async (requestData: Omit<SupportRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .insert([{
          ...requestData,
          user_id: user?.id || null,
          status: 'open'
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error creating support request",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Support request created!",
        description: "We'll get back to you soon."
      });
    } catch (error) {
      console.error('Error creating support request:', error);
      toast({
        title: "Error creating support request",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateSupportRequest = async (id: string, updates: Partial<SupportRequest>) => {
    try {
      const { error } = await supabase
        .from('support_requests')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error updating support request",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Support request updated!",
        description: "Changes have been saved."
      });
    } catch (error) {
      console.error('Error updating support request:', error);
      toast({
        title: "Error updating support request",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteSupportRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('support_requests')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting support request",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Support request deleted!",
        description: "The request has been removed."
      });
    } catch (error) {
      console.error('Error deleting support request:', error);
      toast({
        title: "Error deleting support request",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <SupportContext.Provider
      value={{
        supportRequests,
        createSupportRequest,
        updateSupportRequest,
        deleteSupportRequest,
        loading
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
}
