
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  name: string;
  type: 'auth_confirmation' | 'auth_password_reset' | 'auth_magic_link' | 'newsletter' | 'order_status' | 'promotion' | 'welcome' | 'support';
  subject: string;
  content: string;
  variables: string[];
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface EmailHistory {
  id: string;
  template_id?: string;
  recipient_type: string;
  recipient_email?: string;
  subject: string;
  content: string;
  status: 'pending' | 'sent' | 'failed' | 'scheduled';
  sent_at?: string;
  error_message?: string;
  metadata: any;
  created_at: string;
}

interface EmailContextType {
  templates: EmailTemplate[];
  emailHistory: EmailHistory[];
  loading: boolean;
  fetchTemplates: () => Promise<void>;
  fetchEmailHistory: () => Promise<void>;
  createTemplate: (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTemplate: (id: string, template: Partial<EmailTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  sendEmail: (emailData: {
    templateId?: string;
    recipientType: 'all' | 'customers' | 'subscribers' | 'custom';
    customRecipient?: string;
    subject: string;
    content: string;
    variables?: Record<string, string>;
  }) => Promise<void>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      // Use type assertion to bypass TypeScript strict typing for new tables
      const { data, error } = await (supabase as any)
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching email templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email templates",
        variant: "destructive"
      });
    }
  };

  const fetchEmailHistory = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('email_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEmailHistory(data || []);
    } catch (error: any) {
      console.error('Error fetching email history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email history",
        variant: "destructive"
      });
    }
  };

  const createTemplate = async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await (supabase as any)
        .from('email_templates')
        .insert(template);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email template created successfully"
      });

      await fetchTemplates();
    } catch (error: any) {
      console.error('Error creating email template:', error);
      toast({
        title: "Error",
        description: "Failed to create email template",
        variant: "destructive"
      });
    }
  };

  const updateTemplate = async (id: string, updates: Partial<EmailTemplate>) => {
    try {
      const { error } = await (supabase as any)
        .from('email_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email template updated successfully"
      });

      await fetchTemplates();
    } catch (error: any) {
      console.error('Error updating email template:', error);
      toast({
        title: "Error",
        description: "Failed to update email template",
        variant: "destructive"
      });
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email template deleted successfully"
      });

      await fetchTemplates();
    } catch (error: any) {
      console.error('Error deleting email template:', error);
      toast({
        title: "Error",
        description: "Failed to delete email template",
        variant: "destructive"
      });
    }
  };

  const sendEmail = async (emailData: {
    templateId?: string;
    recipientType: 'all' | 'customers' | 'subscribers' | 'custom';
    customRecipient?: string;
    subject: string;
    content: string;
    variables?: Record<string, string>;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-custom-email', {
        body: emailData
      });

      if (error) throw error;

      toast({
        title: "Email Sent Successfully!",
        description: `Email sent to ${data.recipients} recipients`
      });

      await fetchEmailHistory();
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send email",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTemplates(), fetchEmailHistory()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const value: EmailContextType = {
    templates,
    emailHistory,
    loading,
    fetchTemplates,
    fetchEmailHistory,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    sendEmail
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
}

export function useEmails() {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmails must be used within an EmailProvider');
  }
  return context;
}
