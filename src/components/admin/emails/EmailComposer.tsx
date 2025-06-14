
import React, { useState } from 'react';
import { Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmailTemplate } from '@/types/email';

interface EmailComposerProps {
  templates: EmailTemplate[];
  emailData: {
    recipient: string;
    customRecipient: string;
    subject: string;
    content: string;
    template: string;
    variables: Record<string, string>;
  };
  setEmailData: (data: any) => void;
  onSendEmail: () => void;
  isLoading: boolean;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
}

export function EmailComposer({ 
  templates, 
  emailData, 
  setEmailData, 
  onSendEmail, 
  isLoading, 
  previewMode, 
  setPreviewMode 
}: EmailComposerProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Compose Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipients</Label>
          <Select value={emailData.recipient} onValueChange={(value) => setEmailData({...emailData, recipient: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="customers">All Customers</SelectItem>
              <SelectItem value="subscribers">Newsletter Subscribers</SelectItem>
              <SelectItem value="custom">Custom Email</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {emailData.recipient === 'custom' && (
          <div>
            <Label htmlFor="customRecipient">Email Address</Label>
            <Input
              id="customRecipient"
              type="email"
              placeholder="user@example.com"
              value={emailData.customRecipient}
              onChange={(e) => setEmailData({...emailData, customRecipient: e.target.value})}
            />
          </div>
        )}

        <div>
          <Label htmlFor="template">Use Template (Optional)</Label>
          <Select value={emailData.template} onValueChange={handleTemplateSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Email subject line"
            value={emailData.subject}
            onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="content">Email Content (HTML)</Label>
          <Textarea
            id="content"
            placeholder="Write your email content here... You can use HTML tags and variables like {{user_name}}"
            className="min-h-[300px] font-mono text-sm"
            value={emailData.content}
            onChange={(e) => setEmailData({...emailData, content: e.target.value})}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setPreviewMode(!previewMode)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={onSendEmail} disabled={isLoading} className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send Email'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
