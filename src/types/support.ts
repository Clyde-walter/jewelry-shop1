
export interface SupportRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_response?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}
