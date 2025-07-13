
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "https://esm.sh/resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NewsletterRequest {
  subject: string;
  content: string;
  recipientType: 'all' | 'subscribers' | 'customers';
  templateId?: string;
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

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { subject, content, recipientType, templateId } = await req.json() as NewsletterRequest;

    console.log('Processing newsletter request:', { subject, recipientType });

    // Get recipients based on type
    let recipients: string[] = [];
    
    if (recipientType === 'all') {
      // Get all users from auth.users
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
    } else if (recipientType === 'subscribers') {
      // Get users who have opted into newsletter
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('newsletter', true);
      if (profilesError) throw profilesError;
      
      // Get emails for these users
      const userIds = profiles.map(profile => profile.id);
      if (userIds.length > 0) {
        const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) throw usersError;
        recipients = users.users
          .filter(user => userIds.includes(user.id))
          .map(user => user.email)
          .filter(Boolean) as string[];
      }
    }

    console.log(`Sending newsletter to ${recipients.length} recipients`);

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No recipients found for the specified type' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Send emails using Resend
    const emailPromises = recipients.map(async (email) => {
      try {
        const emailResponse = await resend.emails.send({
          from: 'ShopEase <noreply@shopeasestore.com>',
          to: [email],
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f7f7f7; padding: 20px; text-align: center;">
                <h1 style="color: #333; margin: 0;">ShopEase Newsletter</h1>
              </div>
              <div style="padding: 20px; background-color: white;">
                ${content}
              </div>
              <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>You received this email because you subscribed to ShopEase newsletter.</p>
                <p>© ${new Date().getFullYear()} ShopEase. All rights reserved.</p>
              </div>
            </div>
          `,
        });

        console.log(`Email sent successfully to ${email}:`, emailResponse);

        // Save to email history
        await supabase
          .from('email_history')
          .insert({
            template_id: templateId || null,
            recipient_type: recipientType,
            recipient_email: email,
            subject: subject,
            content: content,
            status: 'sent',
            sent_at: new Date().toISOString(),
            metadata: { 
              resend_id: emailResponse.data?.id,
              newsletter: true 
            }
          });

        return { success: true, email, resend_id: emailResponse.data?.id };
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        
        // Save failed attempt to history
        await supabase
          .from('email_history')
          .insert({
            template_id: templateId || null,
            recipient_type: recipientType,
            recipient_email: email,
            subject: subject,
            content: content,
            status: 'failed',
            error_message: error.message,
            metadata: { newsletter: true }
          });

        return { success: false, email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Newsletter sending completed: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter sent successfully`,
        stats: {
          total: recipients.length,
          successful,
          failed
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-newsletter function:', error);
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
