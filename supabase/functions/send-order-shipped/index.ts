import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderShippedRequest {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderTotal: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
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
    const {
      customerName,
      customerEmail,
      orderNumber,
      orderTotal,
      trackingNumber,
      estimatedDelivery,
      orderItems,
      shippingAddress
    }: OrderShippedRequest = await req.json();

    console.log('Sending order shipped email for:', orderNumber);

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
          <title>Order Shipped - ${orderNumber}</title>
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
              <div style="font-size: 40px; margin-bottom: 20px;">🚚</div>
              <h1 style="color: #111827; margin: 0 0 15px 0; font-size: 28px; font-weight: 700;">Your order is on its way!</h1>
              <p style="font-size: 16px; color: #6b7280; margin: 15px 0;">
                Exciting news, <strong>${customerName}</strong>! Your order has shipped.<br>
                Track your package to see its journey to you.
              </p>
              <div style="background: #dcfce7; border: 1px solid #16a34a; padding: 12px; border-radius: 8px; margin-top: 20px;">
                <span style="color: #166534; font-weight: 600;">Order #${orderNumber}</span>
              </div>
            </div>

            <!-- Progress -->
            <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600; text-align: center;">Order Progress</h2>
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
                  <div style="width: 30px; height: 30px; background: #f59e0b; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold;">🚚</div>
                  <div style="font-size: 12px; font-weight: 600; color: #111827;">Shipped</div>
                  <div style="font-size: 10px; color: #6b7280;">In transit</div>
                </div>
                
                <div style="flex: 1; height: 2px; background: #e5e7eb; margin: 0 10px;"></div>
                
                <div class="progress-step" style="text-align: center; flex: 1;">
                  <div style="width: 30px; height: 30px; background: #e5e7eb; color: #6b7280; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px;">4</div>
                  <div style="font-size: 12px; font-weight: 600; color: #6b7280;">Delivered</div>
                  <div style="font-size: 10px; color: #9ca3af;">Soon</div>
                </div>
              </div>
            </div>

            <!-- Tracking Info -->
            ${trackingNumber ? `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">📦 Tracking Information</h3>
              <p style="margin: 0 0 10px 0; color: #451a03; font-size: 14px;">
                Tracking Number: <strong style="font-family: monospace; background: white; padding: 2px 6px; border-radius: 4px;">${trackingNumber}</strong>
              </p>
              <a href="https://tracking.jewelryport.com/${trackingNumber}" style="display: inline-block; background: #f59e0b; color: white; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 5px;">
                Track Package
              </a>
            </div>
            ` : ''}

            <!-- Action Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://jewelryport.com/orders/${orderNumber}" class="button" style="display: inline-block; background: #f59e0b; color: white; padding: 14px 28px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 16px;">
                View Order Details
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
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Shipping address</h3>
                <div style="color: #6b7280; line-height: 1.5;">
                  <div style="font-weight: 600; color: #374151;">${shippingAddress?.fullName || customerName}</div>
                  ${shippingAddress?.address}<br>
                  ${shippingAddress?.city}, ${shippingAddress?.state} ${shippingAddress?.zipCode}<br>
                  ${shippingAddress?.country}
                </div>
              </div>
              
              <div style="flex: 1; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Delivery</h3>
                <div style="margin-bottom: 15px;">
                  <div style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">Estimated delivery:</div>
                  <div style="color: #111827; font-weight: 600; font-size: 16px;">
                    ${estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                  <div style="color: #16a34a; font-size: 12px; margin-top: 5px;">🚚 Standard shipping</div>
                </div>
                <div style="border-top: 1px solid #e5e7eb; padding-top: 10px;">
                  <div style="display: flex; justify-content: space-between; font-weight: 600; color: #111827;">
                    <span>Total paid</span>
                    <span>$${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">Questions about delivery?</h2>
              <p style="margin: 0 0 15px 0; color: #6b7280;">Track your package or contact us for assistance.</p>
              <a href="mailto:support@jewelryport.com" style="color: #f59e0b; text-decoration: none; font-weight: 600;">support@jewelryport.com</a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">© 2024 Jewelry Port. All rights reserved.</p>
            </div>
            
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Jewelry Port <orders@jewelryport.com>",
      to: [customerEmail],
      subject: `Your Order Has Shipped - ${orderNumber}`,
      html: emailHtml,
    });

    console.log("Order shipped email sent successfully:", emailResponse);

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
    console.error("Error sending order shipped email:", error);
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