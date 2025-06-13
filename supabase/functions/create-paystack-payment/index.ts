
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { amount, email, customerInfo, cartItems } = await req.json();
    
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    // Initialize Paystack transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to kobo (Paystack uses smallest currency unit)
        email: email,
        currency: "NGN", // Nigerian Naira - change as needed
        callback_url: `${req.headers.get("origin")}/payment-success`,
        metadata: {
          user_id: user.id,
          customer_info: customerInfo,
          cart_items: cartItems,
        },
      }),
    });

    const paymentData = await response.json();

    if (!paymentData.status) {
      throw new Error(paymentData.message || "Failed to initialize payment");
    }

    // Store pending order in database
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: orderData, error: orderError } = await supabaseService
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: `PAY-${paymentData.data.reference}`,
        items: cartItems,
        total: amount,
        status: "pending",
        customer_info: customerInfo,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
    }

    return new Response(
      JSON.stringify({
        authorization_url: paymentData.data.authorization_url,
        access_code: paymentData.data.access_code,
        reference: paymentData.data.reference,
        order_id: orderData?.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
