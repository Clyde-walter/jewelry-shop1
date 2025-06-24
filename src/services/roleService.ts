
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user';

export const roleService = {
  async getUserRoles(userId: string): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }

    return data.map(item => item.role as UserRole);
  },

  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', role)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user role:', error);
      return false;
    }

    return !!data;
  },

  async isAdmin(userId: string): Promise<boolean> {
    return this.hasRole(userId, 'admin');
  },

  async assignRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });

    if (error) {
      throw new Error(`Failed to assign role: ${error.message}`);
    }
  },

  async removeRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) {
      throw new Error(`Failed to remove role: ${error.message}`);
    }
  }
};
