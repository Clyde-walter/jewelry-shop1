
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

interface PasswordResetRequest {
  email: string;
  redirectUrl: string;
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

    const { email, redirectUrl }: PasswordResetRequest = await req.json();

    console.log('Processing password reset request for:', email);

    // Generate OTP for password reset
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Error generating reset link:', error);
      throw error;
    }

    console.log('Generated reset data:', data);

    // Extract the token from the generated link
    const url = new URL(data.properties.action_link);
    const token = url.searchParams.get('token');

    if (!token) {
      throw new Error('Failed to extract reset token');
    }

    // Send custom email via Resend
    const emailResponse = await resend.emails.send({
      from: 'Jewelry Port <noreply@jewelryport.com>',
      to: [email],
      subject: 'Reset Your Jewelry Port Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Jewelry Port</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Password Reset Request</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Reset Your Password</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password for your Jewelry Port account. 
              Use the verification code below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: #8B5CF6; color: white; padding: 15px 30px; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
                ${token.slice(-6)}
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in 1 hour for security reasons.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              If you didn't request this password reset, please ignore this email. 
              Your password will remain unchanged.
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>© 2024 Jewelry Port. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    console.log('Password reset email sent successfully via Resend:', emailResponse.data);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Password reset email sent successfully',
        emailId: emailResponse.data?.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in password reset function:', error);
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
