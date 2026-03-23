import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function validatePaymentInput(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') return { valid: false, error: 'Invalid request body' };
  if (typeof data.amount !== 'number' || data.amount <= 0 || data.amount > 100000000) {
    return { valid: false, error: 'Amount must be a positive number' };
  }
  if (typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 255) {
    return { valid: false, error: 'Invalid email address' };
  }
  if (!data.customerInfo || typeof data.customerInfo !== 'object') {
    return { valid: false, error: 'Customer info is required' };
  }
  if (typeof data.customerInfo.name !== 'string' || data.customerInfo.name.trim().length === 0 || data.customerInfo.name.length > 100) {
    return { valid: false, error: 'Customer name is required and must be under 100 characters' };
  }
  if (!Array.isArray(data.cartItems) || data.cartItems.length === 0 || data.cartItems.length > 50) {
    return { valid: false, error: 'Cart must have 1-50 items' };
  }
  for (const item of data.cartItems) {
    if (!item || typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 100) {
      return { valid: false, error: 'Each cart item must have a valid quantity (1-100)' };
    }
    if (typeof item.price !== 'number' || item.price <= 0) {
      return { valid: false, error: 'Each cart item must have a valid positive price' };
    }
  }
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, email, customerInfo, cartItems } = await req.json();

    // Validate input
    const validation = validatePaymentInput({ amount, email, customerInfo, cartItems });
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    // Generate unique payment reference
    const paymentRef = `FLW_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Prepare Flutterwave payment payload
    const paymentData = {
      tx_ref: paymentRef,
      amount: amount / 100, // Convert back to main currency unit
      currency: "USD",
      redirect_url: `${req.headers.get("origin")}/payment-success`,
      customer: {
        email: customerInfo.email,
        name: customerInfo.name,
        phonenumber: customerInfo.phone || ""
      },
      customizations: {
        title: "ShopEase Payment",
        description: "Payment for order",
        logo: ""
      }
    };

    // Call Flutterwave API to create payment
    const flutterwaveResponse = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("FLUTTERWAVE_SECRET_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData)
    });

    const flutterwaveData = await flutterwaveResponse.json();

    if (flutterwaveData.status === "success") {
      // Create order in database using service role
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Generate order number
      const { data: orderNumber } = await supabaseService.rpc('generate_order_number');

      // Create order
      const { data: order, error: orderError } = await supabaseService
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_number: orderNumber,
          customer_info: customerInfo,
          items: cartItems,
          total: amount / 100,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error('Failed to create order');
      }

      return new Response(
        JSON.stringify({
          payment_link: flutterwaveData.data.link,
          order_id: order.id,
          payment_ref: paymentRef
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      throw new Error(flutterwaveData.message || 'Payment creation failed');
    }

  } catch (error: any) {
    console.error('Flutterwave payment creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});