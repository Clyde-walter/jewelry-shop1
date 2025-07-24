import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  email_confirmed_at: string | null;
  total_orders: number;
  total_spent: number;
  join_date: string;
  last_order: string | null;
  created_at: string;
  updated_at: string;
}

interface CustomersContextType {
  customers: Customer[];
  loading: boolean;
  refreshCustomers: () => Promise<void>;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      // Fetch all users from auth.users via Supabase admin API
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        // Fall back to profiles table if admin access isn't available
        return fetchFromProfiles();
      }

      // Get profiles for additional info
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Get order statistics for each user
      const { data: orderStats, error: orderError } = await supabase
        .from('orders')
        .select('user_id, total, created_at')
        .not('user_id', 'is', null);

      if (orderError) {
        console.error('Error fetching order stats:', orderError);
      }

      // Combine data from auth users, profiles, and order stats
      const formattedCustomers: Customer[] = authUsers.users.map((user: any) => {
        const profile = profiles?.find(p => p.id === user.id);
        const userOrders = orderStats?.filter(order => order.user_id === user.id) || [];
        
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
        const lastOrder = userOrders.length > 0 
          ? userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
          : null;

        const name = profile 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email
          : user.email;

        return {
          id: user.id,
          name,
          email: user.email,
          phone: profile?.phone || null,
          email_confirmed_at: user.email_confirmed_at,
          total_orders: totalOrders,
          total_spent: totalSpent,
          join_date: user.created_at,
          last_order: lastOrder,
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at
        };
      });

      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('Error in fetchCustomers:', error);
      // Fall back to profiles table
      await fetchFromProfiles();
    } finally {
      setLoading(false);
    }
  };

  const fetchFromProfiles = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Error loading customers",
          description: profilesError.message,
          variant: "destructive"
        });
        return;
      }

      // Get order statistics for each user
      const { data: orderStats, error: orderError } = await supabase
        .from('orders')
        .select('user_id, total, created_at')
        .not('user_id', 'is', null);

      if (orderError) {
        console.error('Error fetching order stats:', orderError);
      }

      const formattedCustomers: Customer[] = profiles.map((profile: any) => {
        const userOrders = orderStats?.filter(order => order.user_id === profile.id) || [];
        
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
        const lastOrder = userOrders.length > 0 
          ? userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
          : null;

        const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User';

        return {
          id: profile.id,
          name,
          email: 'N/A', // Email not available from profiles table
          phone: profile.phone || null,
          email_confirmed_at: null,
          total_orders: totalOrders,
          total_spent: totalSpent,
          join_date: profile.created_at,
          last_order: lastOrder,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        };
      });

      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('Error in fetchFromProfiles:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();

    // Set up real-time subscription for profiles changes
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => {
          console.log('Profiles table changed, refetching...');
          fetchCustomers();
        }
      )
      .subscribe();

    // Set up real-time subscription for orders changes
    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          console.log('Orders table changed, refetching...');
          fetchCustomers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  return (
    <CustomersContext.Provider
      value={{
        customers,
        loading,
        refreshCustomers: fetchCustomers
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomersContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
}