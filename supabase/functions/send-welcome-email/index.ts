import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

interface WelcomeEmailRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  confirmationUrl?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, firstName, lastName, confirmationUrl }: WelcomeEmailRequest = await req.json();

    console.log('Processing welcome email request for:', email);

    const displayName = firstName ? `${firstName}${lastName ? ` ${lastName}` : ''}` : email.split('@')[0];

    // Get welcome email template from database
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('type', 'welcome')
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .limit(1)
      .maybeSingle();

    let emailContent: string;
    let emailSubject: string;

    if (template) {
      // Use template from database
      emailSubject = template.subject.replace(/{{user_name}}/g, displayName);
      emailContent = template.content
        .replace(/{{user_name}}/g, displayName)
        .replace(/{{user_email}}/g, email);
      
      if (confirmationUrl) {
        emailContent = emailContent.replace(/{{confirmation_url}}/g, confirmationUrl);
      }
    } else {
      // Default welcome email template
      emailSubject = `Welcome to Jewelry Port, ${displayName}!`;
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 32px; margin: 0;">Welcome to Jewelry Port!</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Your Journey Begins Here</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 40px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
            <h2 style="color: white; margin: 0 0 20px 0; font-size: 24px;">Hello ${displayName}!</h2>
            <p style="color: white; line-height: 1.6; margin-bottom: 0; font-size: 16px;">
              Thank you for joining Jewelry Port. We're excited to have you as part of our community!
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #333; margin: 0 0 20px 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Browse our exclusive jewelry collections</li>
              <li>Save your favorite items to your wishlist</li>
              <li>Track your orders with real-time updates</li>
              <li>Enjoy personalized recommendations</li>
            </ul>
            
            ${confirmationUrl ? `
            <div style="text-align: center; margin: 30px 0 20px 0;">
              <a href="${confirmationUrl}" style="display: inline-block; background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Your Email
              </a>
            </div>
            <p style="color: #666; text-align: center; font-size: 14px; margin: 0;">
              Please verify your email address to access all features
            </p>
            ` : ''}
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>© 2024 Jewelry Port. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      `;
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: 'Jewelry Port <welcome@jewelryport.com>',
      to: [email],
      subject: emailSubject,
      html: emailContent,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    // Log email to history
    const { error: historyError } = await supabase
      .from('email_history')
      .insert({
        template_id: template?.id || null,
        recipient_type: 'custom',
        recipient_email: email,
        subject: emailSubject,
        content: emailContent,
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata: { 
          type: 'welcome',
          firstName,
          lastName,
          emailId: emailResponse.data?.id
        }
      });

    if (historyError) {
      console.error('Error saving email history:', historyError);
    }

    console.log('Welcome email sent successfully via Resend:', emailResponse.data);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Welcome email sent successfully',
        emailId: emailResponse.data?.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in welcome email function:', error);
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