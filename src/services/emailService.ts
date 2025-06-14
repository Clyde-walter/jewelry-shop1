
import { supabase } from '@/integrations/supabase/client';
import { EmailTemplate, EmailHistory, SendEmailData } from '@/types/email';

export const fetchEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const { data, error } = await (supabase as any)
    .from('email_templates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchEmailHistory = async (): Promise<EmailHistory[]> => {
  const { data, error } = await (supabase as any)
    .from('email_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
};

export const createEmailTemplate = async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  const { error } = await (supabase as any)
    .from('email_templates')
    .insert(template);

  if (error) throw error;
};

export const updateEmailTemplate = async (id: string, updates: Partial<EmailTemplate>): Promise<void> => {
  const { error } = await (supabase as any)
    .from('email_templates')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

export const deleteEmailTemplate = async (id: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from('email_templates')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const sendCustomEmail = async (emailData: SendEmailData): Promise<any> => {
  const { data, error } = await supabase.functions.invoke('send-custom-email', {
    body: emailData
  });

  if (error) throw error;
  return data;
};
