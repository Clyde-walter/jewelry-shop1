
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Generate password reset link
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

    console.log('Password reset link generated successfully');

    // Send email using Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const resetUrl = data.properties?.action_link || `${redirectUrl}?token=${data.properties?.hashed_token}`;
    
    const emailResult = await resend.emails.send({
      from: 'Jewelry Port <noreply@resend.dev>',
      to: [email],
      subject: 'Reset Your Jewelry Port Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; margin: 0;">💎 Jewelry Port</h1>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            You requested to reset your password for your Jewelry Port account. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          
          <p style="color: #8B5CF6; word-break: break-all; margin-bottom: 25px;">
            ${resetUrl}
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
          
          <hr style="border: none; height: 1px; background-color: #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent by Jewelry Port. This link will expire in 24 hours.
          </p>
        </div>
      `
    });

    if (emailResult.error) {
      console.error('Failed to send password reset email:', emailResult.error);
      throw new Error('Failed to send password reset email');
    }

    console.log('Password reset email sent successfully:', emailResult.data?.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Password reset email sent successfully'
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
