
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  templateId?: string;
  recipientType: 'all' | 'customers' | 'subscribers' | 'custom';
  customRecipient?: string;
  subject: string;
  content: string;
  variables?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { templateId, recipientType, customRecipient, subject, content, variables = {} } = await req.json() as EmailRequest;

    console.log('Processing email request:', { templateId, recipientType, subject });

    // Get recipients based on type
    let recipients: string[] = [];
    
    if (recipientType === 'custom' && customRecipient) {
      recipients = [customRecipient];
    } else if (recipientType === 'all') {
      // Get all users from auth.users (this requires service role)
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;
      recipients = users.users.map(user => user.email).filter(Boolean) as string[];
    } else if (recipientType === 'customers') {
      // Get customers who have made orders
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('email')
        .eq('status', 'active');
      if (customersError) throw customersError;
      recipients = customers.map(customer => customer.email);
    }

    console.log(`Sending email to ${recipients.length} recipients`);

    // Process content with variables
    let processedContent = content;
    let processedSubject = subject;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value);
    });

    // In a real implementation, you would use a service like Resend, SendGrid, etc.
    // For this demo, we'll simulate sending and log the email history
    
    const emailHistoryEntries = recipients.map(email => ({
      template_id: templateId || null,
      recipient_type: recipientType,
      recipient_email: email,
      subject: processedSubject,
      content: processedContent,
      status: 'sent' as const,
      sent_at: new Date().toISOString(),
      metadata: { variables }
    }));

    // Save to email history
    const { error: historyError } = await supabase
      .from('email_history')
      .insert(emailHistoryEntries);

    if (historyError) {
      console.error('Error saving email history:', historyError);
      throw historyError;
    }

    console.log(`Successfully processed ${recipients.length} emails`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email sent to ${recipients.length} recipients`,
        recipients: recipients.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
