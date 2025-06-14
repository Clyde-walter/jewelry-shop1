
import React from 'react';
import { History, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmailHistory as EmailHistoryType } from '@/types/email';

interface EmailHistoryProps {
  emailHistory: EmailHistoryType[];
}

export function EmailHistory({ emailHistory }: EmailHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Email History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {emailHistory.length > 0 ? (
          <div className="space-y-4">
            {emailHistory.map((email) => (
              <div key={email.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{email.subject}</h4>
                    <Badge variant={email.status === 'sent' ? 'default' : 'destructive'}>
                      {email.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(email.created_at)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>To:</strong> {email.recipient_email || email.recipient_type}</p>
                  {email.sent_at && <p><strong>Sent:</strong> {formatDate(email.sent_at)}</p>}
                  {email.error_message && (
                    <p className="text-red-600"><strong>Error:</strong> {email.error_message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No emails sent yet. Your email history will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
