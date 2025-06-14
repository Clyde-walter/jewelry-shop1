
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
        <div className="relative border rounded-lg p-4 bg-white min-h-[400px] h-[400px] max-h-[max(400px,50vh)] overflow-auto">
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
              className="prose max-w-none min-h-[250px] w-full h-full"
              style={{ overflow: "auto", wordBreak: "break-word" }}
              dangerouslySetInnerHTML={{ __html: emailData.content || '<p>Email content will appear here...</p>' }}
            />
          ) : (
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700 overflow-auto min-h-[250px]">
              {emailData.content || 'Email content will appear here...'}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
