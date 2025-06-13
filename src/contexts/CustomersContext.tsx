
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  total_orders: number;
  total_spent: number;
  join_date: string;
  last_order: string | null;
  created_at: string;
  updated_at: string;
}

interface CustomersContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'join_date' | 'last_order' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  loading: boolean;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error loading customers",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      const formattedCustomers: Customer[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone || '',
        status: item.status as 'active' | 'inactive',
        total_orders: item.total_orders || 0,
        total_spent: parseFloat(item.total_spent.toString()) || 0,
        join_date: item.join_date,
        last_order: item.last_order,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('Error in fetchCustomers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();

    // Set up real-time subscription
    const channel = supabase
      .channel('customers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'customers' }, 
        () => {
          console.log('Customers table changed, refetching...');
          fetchCustomers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'join_date' | 'last_order' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          status: customerData.status
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding customer",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Customer added successfully!",
        description: `${customerData.name} has been added to your customers.`
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error adding customer",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          status: customerData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error updating customer",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Customer updated successfully!",
        description: "Customer information has been updated."
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error updating customer",
        description: "Something went wrong. Please try again.",
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

      if (error) {
        toast({
          title: "Error deleting customer",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Customer deleted successfully!",
        description: "The customer has been removed."
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error deleting customer",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <CustomersContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        loading
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
