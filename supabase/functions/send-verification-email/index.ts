import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

interface VerificationEmailRequest {
  email: string;
  redirectUrl?: string;
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

    const { email, redirectUrl }: VerificationEmailRequest = await req.json();

    console.log('Processing email verification request for:', email);

    // Generate email confirmation link
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: redirectUrl || `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app')}/`
      }
    });

    if (error) {
      console.error('Error generating verification link:', error);
      throw error;
    }

    console.log('Generated verification data:', data);

    // Extract the token from the generated link for OTP code
    const url = new URL(data.properties.action_link);
    const token = url.searchParams.get('token');

    if (!token) {
      throw new Error('Failed to extract verification token');
    }

    // Get email template from database if available
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('type', 'auth_confirmation')
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .limit(1)
      .maybeSingle();

    const displayName = email.split('@')[0];
    let emailContent: string;
    let emailSubject: string;

    if (template) {
      // Use template from database
      emailSubject = template.subject.replace(/{{user_name}}/g, displayName);
      emailContent = template.content
        .replace(/{{user_name}}/g, displayName)
        .replace(/{{user_email}}/g, email)
        .replace(/{{confirmation_url}}/g, data.properties.action_link)
        .replace(/{{verification_code}}/g, token.slice(-6));
    } else {
      // Default verification email template
      emailSubject = 'Verify Your Jewelry Port Account';
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Jewelry Port</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Email Verification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Welcome to Jewelry Port! Please verify your email address to complete your account setup.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.properties.action_link}" style="display: inline-block; background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Or use this verification code if the button doesn't work:
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <div style="display: inline-block; background: #8B5CF6; color: white; padding: 15px 30px; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
                ${token.slice(-6)}
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              This verification link will expire in 24 hours for security reasons.
            </p>
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
      from: 'Jewelry Port <verify@jewelryport.com>',
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
          type: 'auth_confirmation',
          emailId: emailResponse.data?.id,
          verificationToken: token.slice(-6)
        }
      });

    if (historyError) {
      console.error('Error saving email history:', historyError);
    }

    console.log('Verification email sent successfully via Resend:', emailResponse.data);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Verification email sent successfully',
        emailId: emailResponse.data?.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in verification email function:', error);
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