
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHash } from "https://deno.land/std@0.190.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CRYPTOMUS-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const apiKey = Deno.env.get("CRYPTOMUS_API_KEY");
    const merchantId = Deno.env.get("CRYPTOMUS_MERCHANT_ID");
    
    if (!apiKey || !merchantId) {
      throw new Error("Cryptomus API credentials not configured");
    }
    
    logStep("Cryptomus credentials verified");

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const body = await req.json();
    const { amount, customerInfo, cartItems } = body;
    
    if (!amount || !customerInfo || !cartItems) {
      throw new Error("Missing required payment data");
    }

    logStep("Payment data received", { amount, customerEmail: customerInfo.email });

    // Create payment data for Cryptomus
    const paymentData = {
      amount: amount.toString(),
      currency: "USD",
      order_id: `ORDER-${Date.now()}-${user.id.slice(0, 8)}`,
      network: "ETH", // Default to Ethereum network
      url_return: `${req.headers.get("origin")}/payment-success`,
      url_callback: `${req.headers.get("origin")}/api/cryptomus-webhook`,
      is_payment_multiple: false,
      lifetime: 3600, // 1 hour
      to_currency: "USDT", // Convert to USDT
    };

    // Create signature for Cryptomus API
    const sortedData = Object.keys(paymentData)
      .sort()
      .reduce((result: any, key) => {
        result[key] = paymentData[key as keyof typeof paymentData];
        return result;
      }, {});

    const dataString = Buffer.from(JSON.stringify(sortedData)).toString('base64');
    const signature = createHash('md5').update(dataString + apiKey).digest('hex');

    logStep("Creating Cryptomus payment", { orderId: paymentData.order_id });

    // Make request to Cryptomus API
    const cryptomusResponse = await fetch('https://api.cryptomus.com/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': merchantId,
        'sign': signature,
      },
      body: JSON.stringify(paymentData),
    });

    if (!cryptomusResponse.ok) {
      const errorData = await cryptomusResponse.text();
      logStep("Cryptomus API error", { status: cryptomusResponse.status, error: errorData });
      throw new Error(`Cryptomus API error: ${cryptomusResponse.status}`);
    }

    const cryptomusData = await cryptomusResponse.json();
    logStep("Cryptomus response received", { success: cryptomusData.state === 0 });

    if (cryptomusData.state !== 0) {
      throw new Error(`Cryptomus error: ${cryptomusData.message || 'Unknown error'}`);
    }

    // Store order in database
    const orderData = {
      user_id: user.id,
      order_number: paymentData.order_id,
      items: cartItems,
      total: amount,
      status: 'pending',
      customer_info: customerInfo,
    };

    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      logStep("Order creation error", { error: orderError.message });
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    logStep("Order created successfully", { orderId: order.id });

    return new Response(JSON.stringify({
      payment_url: cryptomusData.result.url,
      order_id: paymentData.order_id,
      amount: amount,
      currency: paymentData.to_currency,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-cryptomus-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
