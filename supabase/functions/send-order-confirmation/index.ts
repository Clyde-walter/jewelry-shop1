import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderConfirmationRequest {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderTotal: number;
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
      orderItems,
      shippingAddress
    }: OrderConfirmationRequest = await req.json();

    console.log('Sending order confirmation email for:', orderNumber);

    const itemsHtml = orderItems.map(item => `
      <div style="display: flex; align-items: center; padding: 20px 0; border-bottom: 1px solid #e5e5e5;">
        <div style="width: 80px; height: 80px; background: #f5f5f5; border-radius: 8px; margin-right: 20px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">
          Jewelry
        </div>
        <div style="flex: 1;">
          <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px; font-weight: 600;">${item.name}</h4>
          <p style="margin: 0; color: #666; font-size: 14px;">QTY: ${item.quantity}</p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Transaction ID: ${orderNumber.slice(-8)}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-weight: bold; color: #333; font-size: 18px;">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - ${orderNumber}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 40px; padding: 30px 0; background: white; border-radius: 8px;">
            <div style="font-size: 32px; font-weight: bold; color: #3AAEE0; margin-bottom: 10px;">💎 Jewelry Port</div>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 15px; color: #666; font-size: 14px;">
              <span>Rings</span> • <span>Necklaces</span> • <span>Earrings</span> • <span>Bracelets</span> • <span>Watches</span>
            </div>
          </div>

          <!-- Celebration Header -->
          <div style="text-align: center; margin-bottom: 40px; background: white; padding: 40px 20px; border-radius: 8px;">
            <div style="font-size: 24px; margin-bottom: 10px;">⭐ ✨</div>
            <h1 style="color: #333; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">Woohoo! Your order is confirmed.</h1>
            <p style="font-size: 16px; color: #666; margin: 10px 0;">
              <strong>Jewelry Port</strong> will start working on this right away.<br>
              We'll email you as soon as it ships.
            </p>
          </div>

          <!-- Progress Bar -->
          <div style="background: white; padding: 30px 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; position: relative;">
              <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #e5e5e5; z-index: 1;"></div>
              <div style="position: absolute; top: 50%; left: 0; width: 33%; height: 2px; background: #3AAEE0; z-index: 2;"></div>
              
              <div style="text-align: center; z-index: 3; position: relative;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background: #3AAEE0; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 12px;">✓</span>
                </div>
                <div style="font-size: 14px; font-weight: 600; color: #333;">Ordered</div>
                <div style="font-size: 12px; color: #666;">on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
              
              <div style="text-align: center; z-index: 3; position: relative;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background: #e5e5e5; margin: 0 auto 8px;"></div>
                <div style="font-size: 14px; color: #666;">Ready to ship</div>
              </div>
              
              <div style="text-align: center; z-index: 3; position: relative;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background: #e5e5e5; margin: 0 auto 8px;"></div>
                <div style="font-size: 14px; color: #666;">Expected delivery</div>
                <div style="font-size: 12px; color: #666;">${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
            </div>
          </div>

          <!-- View Order Button -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="#" style="display: inline-block; background: #333; color: white; padding: 12px 30px; border-radius: 24px; text-decoration: none; font-weight: 600;">View your order</a>
          </div>

          <div style="font-size: 14px; text-align: center; color: #666; margin-bottom: 40px;">
            Delivery times are estimated. If you're experiencing difficulty with this order, please 
            <a href="mailto:support@jewelryport.com" style="color: #3AAEE0; text-decoration: underline;">contact the seller</a>. 
            See <a href="#" style="color: #3AAEE0; text-decoration: underline;">more info</a>.
          </div>

          <!-- Order Details -->
          <div style="background: white; padding: 0; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
            <div style="background: #f8f9fa; padding: 20px; border-bottom: 1px solid #e5e5e5;">
              <h2 style="margin: 0; font-size: 20px; color: #333;">Order details</h2>
              <p style="margin: 5px 0 0 0; color: #666;">Confirmation number: <strong>${orderNumber}</strong></p>
            </div>
            
            <div style="padding: 0;">
              ${itemsHtml}
            </div>
          </div>

          <!-- Shipping and Payment Info -->
          <div style="display: flex; gap: 20px; margin-bottom: 30px;">
            <div style="flex: 1; background: white; padding: 20px; border-radius: 8px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Shipping address</h3>
              <div style="color: #666; line-height: 1.4;">
                ${shippingAddress?.fullName || customerName}<br>
                ${shippingAddress?.address}<br>
                ${shippingAddress?.city}, ${shippingAddress?.state} ${shippingAddress?.zipCode}<br>
                ${shippingAddress?.country}
              </div>
            </div>
            
            <div style="flex: 1; background: white; padding: 20px; border-radius: 8px;">
              <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Paid with Credit card</h3>
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span style="color: #666;">Subtotal</span>
                  <span style="color: #333;">$${(orderTotal * 0.85).toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span style="color: #666;">Sales tax</span>
                  <span style="color: #333;">$${(orderTotal * 0.08).toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span style="color: #666;">Shipping</span>
                  <span style="color: #333;">$${(orderTotal * 0.07).toFixed(2)}</span>
                </div>
                <div style="color: #666; font-size: 12px; margin-top: 5px;">Standard Shipping</div>
              </div>
              <div style="border-top: 1px solid #e5e5e5; padding-top: 10px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
                  <span>Total (${orderItems.length} item${orderItems.length > 1 ? 's' : ''})</span>
                  <span>$${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Carbon Offset Info -->
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
            <span style="margin-right: 8px;">🌱</span>
            <span style="color: #666; font-size: 14px;">Jewelry Port offsets carbon emissions from every delivery</span>
          </div>

          <!-- Shop Information -->
          <div style="background: white; padding: 30px 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">Shop Information</h2>
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #3AAEE0, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">
                JP
              </div>
              <div style="flex: 1;">
                <h3 style="margin: 0 0 5px 0; color: #333; font-size: 18px;">Jewelry Port</h3>
                <p style="margin: 0; color: #666;">Owner of Jewelry Port</p>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Premium Jewelry Collection</p>
                <div style="margin-top: 8px;">
                  <span style="color: #ffd700;">★★★★★</span>
                </div>
              </div>
              <div>
                <a href="mailto:support@jewelryport.com" style="background: #333; color: white; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-size: 14px;">Help with order</a>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            <p style="color: #999; font-size: 12px; margin: 0;">© 2024 Jewelry Port. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Jewelry Port <orders@jewelryport.com>",
      to: [customerEmail],
      subject: `Order Confirmation - ${orderNumber}`,
      html: emailHtml,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

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
    console.error("Error sending order confirmation email:", error);
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