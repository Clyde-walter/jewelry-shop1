
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EmailTemplate, EmailHistory, SendEmailData } from '@/types/email';
import {
  fetchEmailTemplates,
  fetchEmailHistory,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  sendCustomEmail
} from '@/services/emailService';

export function useEmailOperations() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTemplates = async () => {
    try {
      const data = await fetchEmailTemplates();
      setTemplates(data);
    } catch (error: any) {
      console.error('Error fetching email templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email templates",
        variant: "destructive"
      });
    }
  };

  const loadEmailHistory = async () => {
    try {
      const data = await fetchEmailHistory();
      setEmailHistory(data);
    } catch (error: any) {
      console.error('Error fetching email history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email history",
        variant: "destructive"
      });
    }
  };

  const handleCreateTemplate = async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createEmailTemplate(template);
      toast({
        title: "Success",
        description: "Email template created successfully"
      });
      await loadTemplates();
    } catch (error: any) {
      console.error('Error creating email template:', error);
      toast({
        title: "Error",
        description: "Failed to create email template",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTemplate = async (id: string, updates: Partial<EmailTemplate>) => {
    try {
      await updateEmailTemplate(id, updates);
      toast({
        title: "Success",
        description: "Email template updated successfully"
      });
      await loadTemplates();
    } catch (error: any) {
      console.error('Error updating email template:', error);
      toast({
        title: "Error",
        description: "Failed to update email template",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteEmailTemplate(id);
      toast({
        title: "Success",
        description: "Email template deleted successfully"
      });
      await loadTemplates();
    } catch (error: any) {
      console.error('Error deleting email template:', error);
      toast({
        title: "Error",
        description: "Failed to delete email template",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = async (emailData: SendEmailData) => {
    try {
      const data = await sendCustomEmail(emailData);
      toast({
        title: "Email Sent Successfully!",
        description: `Email sent to ${data.recipients} recipients`
      });
      await loadEmailHistory();
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send email",
        variant: "destructive"
      });
    }
  };

  return {
    templates,
    emailHistory,
    loading,
    setLoading,
    loadTemplates,
    loadEmailHistory,
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleSendEmail
  };
}
