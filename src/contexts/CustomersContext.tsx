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
  user_id?: string;
}

interface CustomersContextType {
  customers: Customer[];
  loading: boolean;
  refreshCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'total_orders' | 'total_spent' | 'last_order'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // First try to get all users from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      // Get all orders with statistics
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total, created_at')
        .not('user_id', 'is', null);

      const combinedCustomers: Customer[] = [];

      // Process auth users if available
      if (!authError && authUsers?.users) {
        authUsers.users.forEach((user: any) => {
          const profile = profiles?.find(p => p.id === user.id);
          const userOrders = orders?.filter(order => order.user_id === user.id) || [];
          
          const totalOrders = userOrders.length;
          const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
          const lastOrder = userOrders.length > 0 
            ? userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
            : null;

          const name = profile 
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Unknown User'
            : user.email?.split('@')[0] || 'Unknown User';

          combinedCustomers.push({
            id: user.id,
            name,
            email: user.email || 'No email',
            phone: profile?.phone || null,
            email_confirmed_at: user.email_confirmed_at,
            total_orders: totalOrders,
            total_spent: totalSpent,
            join_date: user.created_at,
            last_order: lastOrder,
            created_at: user.created_at,
            updated_at: user.updated_at || user.created_at,
            user_id: user.id
          });
        });
      }

      // Add profiles that might not be in auth.users (edge case)
      if (profiles) {
        profiles.forEach((profile: any) => {
          if (!combinedCustomers.find(c => c.id === profile.id)) {
            const userOrders = orders?.filter(order => order.user_id === profile.id) || [];
            
            const totalOrders = userOrders.length;
            const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
            const lastOrder = userOrders.length > 0 
              ? userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
              : null;

            const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User';

            combinedCustomers.push({
              id: profile.id,
              name,
              email: 'Not available',
              phone: profile.phone || null,
              email_confirmed_at: null,
              total_orders: totalOrders,
              total_spent: totalSpent,
              join_date: profile.created_at,
              last_order: lastOrder,
              created_at: profile.created_at,
              updated_at: profile.updated_at,
              user_id: profile.id
            });
          }
        });
      }

      setCustomers(combinedCustomers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error loading customers",
        description: "Failed to load customer data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'total_orders' | 'total_spent' | 'last_order'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          join_date: customerData.join_date || new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Customer added",
        description: "New customer has been successfully added",
      });

      await fetchCustomers();
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error adding customer",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Customer updated",
        description: "Customer information has been successfully updated",
      });

      await fetchCustomers();
    } catch (error: any) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error updating customer",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Customer deleted",
        description: "Customer has been successfully deleted",
      });

      await fetchCustomers();
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error deleting customer", 
        description: error.message,
        variant: "destructive"
      });
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
        refreshCustomers: fetchCustomers,
        addCustomer,
        updateCustomer,
        deleteCustomer
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