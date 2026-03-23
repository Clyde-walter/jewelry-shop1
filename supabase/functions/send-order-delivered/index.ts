import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderDeliveredRequest {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderTotal: number;
  deliveryDate?: string;
  orderItems: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify caller is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const {
      customerName,
      customerEmail,
      orderNumber,
      orderTotal,
      deliveryDate,
      orderItems,
      shippingAddress
    }: OrderDeliveredRequest = await req.json();

    console.log('Sending order delivered email for:', orderNumber);

    const itemsHtml = orderItems.map(item => `
      <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #e5e7eb;">
        <div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px; font-weight: 600;">
          💎
        </div>
        <div style="flex: 1;">
          <h4 style="margin: 0 0 4px 0; color: #111827; font-size: 14px; font-weight: 600;">${item.name}</h4>
          <div style="color: #6b7280; font-size: 12px;">
            QTY: ${item.quantity} • $${item.price.toFixed(2)} each
          </div>
        </div>
        <div style="font-weight: 600; color: #111827;">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Delivered - ${orderNumber}</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; margin: 0 !important; padding: 10px !important; }
              .card { margin: 10px 0 !important; }
              .progress-container { flex-direction: column !important; }
              .progress-step { margin: 5px 0 !important; }
              h1 { font-size: 24px !important; }
              .button { padding: 12px 20px !important; font-size: 14px !important; }
            }
          </style>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
          
          <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <img src="https://kirxlakwwzpkrmipdelj.supabase.co/storage/v1/object/public/product-images/06008771-3946-4cde-95f5-eed2a260f2ae.png" alt="Jewelry Port" style="height: 40px; margin-bottom: 10px;">
              <div style="color: #f97316; font-size: 14px; font-weight: 500;">Jewelry | Accessories | Wedding | Craft Supplies</div>
            </div>

            <!-- Main Message -->
            <div style="text-align: center; margin-bottom: 30px; background: white; padding: 40px 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="font-size: 40px; margin-bottom: 20px;">🎉</div>
              <h1 style="color: #111827; margin: 0 0 15px 0; font-size: 28px; font-weight: 700;">Woohoo! Your order has been delivered.</h1>
              <p style="font-size: 16px; color: #6b7280; margin: 15px 0;">
                <strong>${customerName}</strong>, your order has arrived safely!<br>
                We hope you love your new items from Jewelry Port.
              </p>
              <div style="background: #dcfce7; border: 1px solid #16a34a; padding: 12px; border-radius: 8px; margin-top: 20px;">
                <span style="color: #166534; font-weight: 600;">Order #${orderNumber}</span>
              </div>
            </div>

            <!-- Progress -->
            <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600; text-align: center;">Order Journey Complete</h2>
              <div class="progress-container" style="display: flex; align-items: center; justify-content: space-between;">
                
                <div class="progress-step" style="text-align: center; flex: 1;">
                  <div style="width: 30px; height: 30px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold;">✓</div>
                  <div style="font-size: 12px; font-weight: 600; color: #111827;">Ordered</div>
                  <div style="font-size: 10px; color: #6b7280;">Complete</div>
                </div>
                
                <div style="flex: 1; height: 2px; background: #22c55e; margin: 0 10px;"></div>
                
                <div class="progress-step" style="text-align: center; flex: 1;">
                  <div style="width: 30px; height: 30px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold;">✓</div>
                  <div style="font-size: 12px; font-weight: 600; color: #111827;">Processed</div>
                  <div style="font-size: 10px; color: #6b7280;">Complete</div>
                </div>
                
                <div style="flex: 1; height: 2px; background: #22c55e; margin: 0 10px;"></div>
                
                <div class="progress-step" style="text-align: center; flex: 1;">
                  <div style="width: 30px; height: 30px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold;">✓</div>
                  <div style="font-size: 12px; font-weight: 600; color: #111827;">Shipped</div>
                  <div style="font-size: 10px; color: #6b7280;">Complete</div>
                </div>
                
                <div style="flex: 1; height: 2px; background: #22c55e; margin: 0 10px;"></div>
                
                <div class="progress-step" style="text-align: center; flex: 1;">
                  <div style="width: 30px; height: 30px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold;">🎉</div>
                  <div style="font-size: 12px; font-weight: 600; color: #111827;">Delivered</div>
                  <div style="font-size: 10px; color: #6b7280;">${deliveryDate || 'Today'}</div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 30px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <a href="https://jewelryport.com/reviews?order=${orderNumber}" class="button" style="display: inline-block; background: #22c55e; color: white; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 16px;">
                ⭐ Write a Review
              </a>
              <a href="https://jewelryport.com/products" class="button" style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Shop Again
              </a>
            </div>

            <!-- Order Details -->
            <div style="background: white; padding: 0; border-radius: 12px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="background: #f9fafb; padding: 20px; border-bottom: 1px solid #e5e7eb;">
                <h2 style="margin: 0; font-size: 18px; color: #111827; font-weight: 600;">Order details</h2>
                <p style="margin: 8px 0 0 0; color: #6b7280;">Confirmation number: <strong style="color: #374151; font-family: monospace;">${orderNumber}</strong></p>
              </div>
              ${itemsHtml}
            </div>

            <!-- Summary -->
            <div style="display: flex; gap: 15px; margin-bottom: 30px;">
              <div style="flex: 1; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Delivered to</h3>
                <div style="color: #6b7280; line-height: 1.5;">
                  <div style="font-weight: 600; color: #374151;">${shippingAddress?.fullName || customerName}</div>
                  ${shippingAddress?.address}<br>
                  ${shippingAddress?.city}, ${shippingAddress?.state} ${shippingAddress?.zipCode}<br>
                  ${shippingAddress?.country}
                </div>
                <div style="margin-top: 10px; color: #22c55e; font-size: 12px; font-weight: 600;">
                  ✓ Successfully delivered
                </div>
              </div>
              
              <div style="flex: 1; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Order summary</h3>
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #6b7280;">Subtotal</span>
                    <span style="color: #374151;">$${(orderTotal * 0.85).toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #6b7280;">Tax</span>
                    <span style="color: #374151;">$${(orderTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #6b7280;">Shipping</span>
                    <span style="color: #374151;">$${(orderTotal * 0.07).toFixed(2)}</span>
                  </div>
                </div>
                <div style="border-top: 1px solid #e5e7eb; padding-top: 10px;">
                  <div style="display: flex; justify-content: space-between; font-weight: 600; color: #111827;">
                    <span>Total</span>
                    <span>$${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Care Instructions -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #0ea5e9; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 16px; font-weight: 600;">💎 Care Instructions</h3>
              <p style="margin: 0; color: #0369a1; font-size: 14px; line-height: 1.5;">
                To keep your jewelry looking beautiful:<br>
                • Store in a dry place away from moisture<br>
                • Clean gently with a soft cloth<br>
                • Avoid exposure to chemicals and perfumes
              </p>
            </div>

            <!-- Review Request -->
            <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">Love your purchase?</h2>
              <p style="margin: 0 0 20px 0; color: #6b7280;">Share your experience and help other customers discover great products!</p>
              <a href="https://jewelryport.com/reviews?order=${orderNumber}" style="display: inline-block; background: #fbbf24; color: white; padding: 12px 24px; border-radius: 20px; text-decoration: none; font-weight: 600; font-size: 14px;">
                ⭐⭐⭐⭐⭐ Write a Review
              </a>
            </div>

            <!-- Contact Info -->
            <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">Questions or concerns?</h2>
              <p style="margin: 0 0 15px 0; color: #6b7280;">We're here to help with any issues or questions about your order.</p>
              <a href="mailto:support@jewelryport.com" style="color: #22c55e; text-decoration: none; font-weight: 600;">support@jewelryport.com</a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">Thank you for choosing Jewelry Port!</p>
              <p style="margin: 0;">© 2024 Jewelry Port. All rights reserved.</p>
            </div>
            
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Jewelry Port <orders@jewelryport.com>",
      to: [customerEmail],
      subject: `Order Delivered - ${orderNumber}`,
      html: emailHtml,
    });

    console.log("Order delivered email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending order delivered email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);