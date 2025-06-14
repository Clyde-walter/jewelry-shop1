
export interface EmailTemplate {
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

export interface EmailHistory {
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

export interface SendEmailData {
  templateId?: string;
  recipientType: 'all' | 'customers' | 'subscribers' | 'custom';
  customRecipient?: string;
  subject: string;
  content: string;
  variables?: Record<string, string>;
}
