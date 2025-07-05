import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transaction_id, tx_ref } = await req.json();

    if (!transaction_id) {
      throw new Error('Transaction ID is required');
    }

    // Verify payment with Flutterwave
    const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("FLUTTERWAVE_SECRET_KEY")}`,
        "Content-Type": "application/json",
      }
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.status === "success" && verifyData.data.status === "successful") {
      // Payment is successful, update order status
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Find and update the order
      const { data: order, error: updateError } = await supabaseService
        .from('orders')
        .update({ 
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('order_number', tx_ref.replace('FLW_', '').split('_')[0])
        .select()
        .single();

      if (updateError) {
        console.error('Order update error:', updateError);
        throw new Error('Failed to update order status');
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment verified successfully',
          order: order,
          transaction: verifyData.data
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Payment verification failed',
          status: verifyData.data?.status || 'unknown'
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

  } catch (error: any) {
    console.error('Flutterwave verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});