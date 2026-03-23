import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderCancelledRequest {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderTotal: number;
  cancellationReason?: string;
  refundAmount?: number;
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
      cancellationReason,
      refundAmount,
      orderItems,
      shippingAddress
    }: OrderCancelledRequest = await req.json();

    console.log('Sending order cancelled email for:', orderNumber);

    const itemsHtml = orderItems.map(item => `
      <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #e5e7eb; opacity: 0.7;">
        <div style="width: 60px; height: 60px; background: #f3f4f6; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px; font-weight: 600;">
          💎
        </div>
        <div style="flex: 1;">
          <h4 style="margin: 0 0 4px 0; color: #111827; font-size: 14px; font-weight: 600; text-decoration: line-through;">${item.name}</h4>
          <div style="color: #6b7280; font-size: 12px;">
            QTY: ${item.quantity} • $${item.price.toFixed(2)} each
          </div>
        </div>
        <div style="font-weight: 600; color: #111827; text-decoration: line-through;">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Cancelled - ${orderNumber}</title>
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
              <div style="font-size: 40px; margin-bottom: 20px;">❌</div>
              <h1 style="color: #111827; margin: 0 0 15px 0; font-size: 28px; font-weight: 700;">Your order has been cancelled</h1>
              <p style="font-size: 16px; color: #6b7280; margin: 15px 0;">
                Hi <strong>${customerName}</strong>, we've cancelled your order as requested.<br>
                ${cancellationReason ? `Reason: ${cancellationReason}` : 'No specific reason provided.'}
              </p>
              <div style="background: #fee2e2; border: 1px solid #fca5a5; padding: 12px; border-radius: 8px; margin-top: 20px;">
                <span style="color: #dc2626; font-weight: 600;">Order #${orderNumber} - Cancelled</span>
              </div>
            </div>

            <!-- Refund Information -->
            ${refundAmount ? `
            <div style="background: #f0fdf4; border: 1px solid #22c55e; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #15803d; font-size: 16px; font-weight: 600;">💰 Refund Information</h3>
              <p style="margin: 0 0 10px 0; color: #166534; font-size: 14px;">
                A refund of <strong>$${refundAmount.toFixed(2)}</strong> has been processed to your original payment method.
              </p>
              <p style="margin: 0; color: #16a34a; font-size: 12px;">
                Please allow 3-5 business days for the refund to appear in your account.
              </p>
            </div>
            ` : `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">💰 Refund Processing</h3>
              <p style="margin: 0; color: #451a03; font-size: 14px;">
                Your refund is being processed and will be credited to your original payment method within 3-5 business days.
              </p>
            </div>
            `}

            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 30px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <a href="https://jewelryport.com/products" class="button" style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Continue Shopping
              </a>
              <a href="https://jewelryport.com/support" class="button" style="display: inline-block; background: #6b7280; color: white; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Contact Support
              </a>
            </div>

            <!-- Order Details -->
            <div style="background: white; padding: 0; border-radius: 12px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="background: #f9fafb; padding: 20px; border-bottom: 1px solid #e5e7eb;">
                <h2 style="margin: 0; font-size: 18px; color: #111827; font-weight: 600;">Cancelled order details</h2>
                <p style="margin: 8px 0 0 0; color: #6b7280;">Confirmation number: <strong style="color: #374151; font-family: monospace;">${orderNumber}</strong></p>
              </div>
              ${itemsHtml}
            </div>

            <!-- Summary -->
            <div style="display: flex; gap: 15px; margin-bottom: 30px;">
              <div style="flex: 1; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Original shipping address</h3>
                <div style="color: #6b7280; line-height: 1.5; opacity: 0.7;">
                  <div style="font-weight: 600; color: #374151;">${shippingAddress?.fullName || customerName}</div>
                  ${shippingAddress?.address}<br>
                  ${shippingAddress?.city}, ${shippingAddress?.state} ${shippingAddress?.zipCode}<br>
                  ${shippingAddress?.country}
                </div>
              </div>
              
              <div style="flex: 1; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Refund summary</h3>
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #6b7280;">Original total</span>
                    <span style="color: #374151; text-decoration: line-through;">$${orderTotal.toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #6b7280;">Processing fee</span>
                    <span style="color: #374151;">-$${(orderTotal * 0.03).toFixed(2)}</span>
                  </div>
                </div>
                <div style="border-top: 1px solid #e5e7eb; padding-top: 10px;">
                  <div style="display: flex; justify-content: space-between; font-weight: 600; color: #22c55e;">
                    <span>Refund amount</span>
                    <span>$${(refundAmount || (orderTotal * 0.97)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Why This Happened -->
            <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">Why was your order cancelled?</h2>
              <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                ${cancellationReason ? `
                  <p style="margin: 0 0 15px 0;"><strong>Reason:</strong> ${cancellationReason}</p>
                ` : ''}
                <p style="margin: 0 0 10px 0;">Common reasons for cancellation include:</p>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Customer request</li>
                  <li>Payment issues</li>
                  <li>Item out of stock</li>
                  <li>Address verification problems</li>
                </ul>
              </div>
            </div>

            <!-- We're Sorry -->
            <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">We're sorry to see you go</h2>
              <p style="margin: 0 0 20px 0; color: #6b7280;">We hope you'll give us another chance. Check out our latest collection of beautiful jewelry pieces.</p>
              <a href="https://jewelryport.com/collections/featured" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 20px; text-decoration: none; font-weight: 600; font-size: 14px;">
                Browse Featured Items
              </a>
            </div>

            <!-- Contact Info -->
            <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">Need help or have questions?</h2>
              <p style="margin: 0 0 15px 0; color: #6b7280;">Our support team is here to assist you with any concerns about your cancellation or refund.</p>
              <a href="mailto:support@jewelryport.com" style="color: #dc2626; text-decoration: none; font-weight: 600;">support@jewelryport.com</a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0 0 10px 0;">We appreciate your understanding.</p>
              <p style="margin: 0;">© 2024 Jewelry Port. All rights reserved.</p>
            </div>
            
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Jewelry Port <orders@jewelryport.com>",
      to: [customerEmail],
      subject: `Order Cancelled - ${orderNumber}`,
      html: emailHtml,
    });

    console.log("Order cancelled email sent successfully:", emailResponse);

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
    console.error("Error sending order cancelled email:", error);
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