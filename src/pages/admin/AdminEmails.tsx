
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmails } from '@/contexts/EmailContext';
import { EmailComposer } from '@/components/admin/emails/EmailComposer';
import { EmailPreview } from '@/components/admin/emails/EmailPreview';
import { EmailTemplatesManager } from '@/components/admin/emails/EmailTemplatesManager';
import { EmailHistory } from '@/components/admin/emails/EmailHistory';

export function AdminEmails() {
  const { templates, emailHistory, loading, sendEmail, createTemplate, updateTemplate, deleteTemplate } = useEmails();
  
  const [emailData, setEmailData] = useState({
    recipient: 'all',
    customRecipient: '',
    subject: '',
    content: '',
    template: '',
    variables: {}
  });
  
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEmailData({
        ...emailData,
        subject: template.subject,
        content: template.content,
        template: templateId
      });
    }
  };

  const handleSendEmail = async () => {
    if (!emailData.subject || !emailData.content) {
      return;
    }

    setIsLoading(true);
    
    try {
      await sendEmail({
        templateId: emailData.template || undefined,
        recipientType: emailData.recipient as any,
        customRecipient: emailData.customRecipient || undefined,
        subject: emailData.subject,
        content: emailData.content,
        variables: emailData.variables
      });
      
      // Reset form
      setEmailData({
        recipient: 'all',
        customRecipient: '',
        subject: '',
        content: '',
        template: '',
        variables: {}
      });
      
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async (template: any) => {
    try {
      await createTemplate(template);
    } catch (error) {
      console.error('Create template error:', error);
    }
  };

  const handleUpdateTemplate = async (id: string, updates: any) => {
    try {
      await updateTemplate(id, updates);
    } catch (error) {
      console.error('Update template error:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Loading email management...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Management</h1>
        <p className="text-gray-600">Manage email templates and send messages to your users</p>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
          <TabsTrigger value="templates">Email Templates ({templates.length})</TabsTrigger>
          <TabsTrigger value="history">Email History ({emailHistory.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmailComposer
              templates={templates}
              emailData={emailData}
              setEmailData={setEmailData}
              onSendEmail={handleSendEmail}
              isLoading={isLoading}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
            />
            <EmailPreview 
              emailData={emailData}
              previewMode={previewMode}
            />
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <EmailTemplatesManager
            templates={templates}
            onCreateTemplate={handleCreateTemplate}
            onUpdateTemplate={handleUpdateTemplate}
            onDeleteTemplate={deleteTemplate}
            onUseTemplate={handleTemplateSelect}
          />
        </TabsContent>

        <TabsContent value="history">
          <EmailHistory emailHistory={emailHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
