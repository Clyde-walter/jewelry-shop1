
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthEmailRequest {
  type: 'auth_confirmation' | 'auth_password_reset' | 'auth_magic_link';
  user_email: string;
  user_name?: string;
  confirmation_url?: string;
  reset_url?: string;
  magic_link_url?: string;
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

    const { type, user_email, user_name, confirmation_url, reset_url, magic_link_url } = await req.json() as AuthEmailRequest;

    console.log('Processing auth email request:', { type, user_email });

    // Get the active template for this auth email type
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .limit(1)
      .single();

    if (templateError) {
      console.error('Error fetching template:', templateError);
      throw new Error('Email template not found');
    }

    // Prepare variables for template processing
    const variables: Record<string, string> = {
      user_name: user_name || user_email.split('@')[0],
      user_email,
    };

    if (confirmation_url) variables.confirmation_url = confirmation_url;
    if (reset_url) variables.reset_url = reset_url;
    if (magic_link_url) variables.magic_link_url = magic_link_url;

    // Process template content with variables
    let processedContent = template.content;
    let processedSubject = template.subject;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value);
    });

    // Log the email to history
    const { error: historyError } = await supabase
      .from('email_history')
      .insert({
        template_id: template.id,
        recipient_type: 'custom',
        recipient_email: user_email,
        subject: processedSubject,
        content: processedContent,
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata: { type, variables }
      });

    if (historyError) {
      console.error('Error saving email history:', historyError);
    }

    console.log(`Auth email processed for ${user_email}`);

    // In a real implementation, you would send the actual email here
    // For now, we'll return the processed template
    return new Response(
      JSON.stringify({ 
        success: true,
        subject: processedSubject,
        content: processedContent,
        template_used: template.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing auth email:', error);
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
