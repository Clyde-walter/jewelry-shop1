
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailPreviewProps {
  emailData: {
    recipient: string;
    customRecipient: string;
    subject: string;
    content: string;
  };
  previewMode: boolean;
}

export function EmailPreview({ emailData, previewMode }: EmailPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 bg-white min-h-[400px]">
          <div className="mb-4 pb-4 border-b">
            <div className="text-sm text-gray-600 mb-2">
              <strong>From:</strong> noreply@shopease.com
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <strong>To:</strong> {emailData.recipient === 'custom' ? emailData.customRecipient : emailData.recipient}
            </div>
            <div className="text-lg font-semibold">
              <strong>Subject:</strong> {emailData.subject || 'Email Subject'}
            </div>
          </div>
          
          {previewMode ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: emailData.content || '<p>Email content will appear here...</p>' }}
            />
          ) : (
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 overflow-auto">
              {emailData.content || 'Email content will appear here...'}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
