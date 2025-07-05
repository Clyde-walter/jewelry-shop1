
import { supabase } from '@/integrations/supabase/client';

export interface WarrantyClaimData {
  user_id?: string;
  order_number: string;
  product_name: string;
  purchase_date: string;
  issue_description: string;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
}

export interface ContactRequestData {
  user_id?: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
}

export interface ReturnRequestData {
  user_id?: string;
  order_number: string;
  customer_email: string;
  reason: string;
  description?: string;
}

export interface SupportRequestData {
  user_id?: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export const requestService = {
  async submitWarrantyClaim(data: WarrantyClaimData) {
    const { error } = await supabase
      .from('warranty_claims')
      .insert({
        user_id: data.user_id || null,
        order_number: data.order_number,
        product_name: data.product_name,
        purchase_date: data.purchase_date,
        issue_description: data.issue_description,
        customer_email: data.customer_email,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        status: 'pending',
        priority: 'medium'
      });

    if (error) throw error;
    return { success: true };
  },

  async submitContactRequest(data: ContactRequestData) {
    const { error } = await supabase
      .from('contact_requests')
      .insert({
        user_id: data.user_id || null,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        subject: data.subject,
        message: data.message,
        status: 'open',
        priority: 'medium'
      });

    if (error) throw error;
    return { success: true };
  },

  async submitReturnRequest(data: ReturnRequestData) {
    const { error } = await supabase
      .from('return_requests')
      .insert({
        user_id: data.user_id || null,
        order_number: data.order_number,
        customer_email: data.customer_email,
        reason: data.reason,
        description: data.description,
        status: 'pending',
        priority: 'medium'
      });

    if (error) throw error;
    return { success: true };
  },

  async submitSupportRequest(data: SupportRequestData) {
    const { error } = await supabase
      .from('support_requests')
      .insert({
        user_id: data.user_id || null,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        subject: data.subject,
        message: data.message,
        priority: data.priority,
        status: 'open'
      });

    if (error) throw error;
    return { success: true };
  }
};
