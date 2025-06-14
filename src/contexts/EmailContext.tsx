
import React, { createContext, useContext, useEffect } from 'react';
import { EmailTemplate, EmailHistory, SendEmailData } from '@/types/email';
import { useEmailOperations } from '@/hooks/useEmailOperations';

interface EmailContextType {
  templates: EmailTemplate[];
  emailHistory: EmailHistory[];
  loading: boolean;
  fetchTemplates: () => Promise<void>;
  fetchEmailHistory: () => Promise<void>;
  createTemplate: (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTemplate: (id: string, template: Partial<EmailTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  sendEmail: (emailData: SendEmailData) => Promise<void>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: React.ReactNode }) {
  const {
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
  } = useEmailOperations();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadTemplates(), loadEmailHistory()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const value: EmailContextType = {
    templates,
    emailHistory,
    loading,
    fetchTemplates: loadTemplates,
    fetchEmailHistory: loadEmailHistory,
    createTemplate: handleCreateTemplate,
    updateTemplate: handleUpdateTemplate,
    deleteTemplate: handleDeleteTemplate,
    sendEmail: handleSendEmail
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
