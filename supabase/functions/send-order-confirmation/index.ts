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
      <div class="product-item" style="display: flex; align-items: center; padding: 30px; border-bottom: 1px solid #f1f5f9; transition: background-color 0.2s ease;">
        <div class="product-image" style="width: 100px; height: 100px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; margin-right: 25px; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 14px; font-weight: 600; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 5px;">💎</div>
            <div>Jewelry</div>
          </div>
        </div>
        <div style="flex: 1; min-width: 0;">
          <h4 style="margin: 0 0 8px 0; color: #111827; font-size: 18px; font-weight: 700; line-height: 1.3;">${item.name}</h4>
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 8px;">
            <div style="background: #f0f9ff; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">
              Qty: ${item.quantity}
            </div>
            <div style="color: #6b7280; font-size: 14px; font-weight: 500;">
              Item #${orderNumber.slice(-8)}${item.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div style="color: #6b7280; font-size: 14px;">
            <span style="color: #16a34a; font-weight: 500;">✓ In Stock</span> • 
            <span>Premium Quality</span> • 
            <span>5-Year Warranty</span>
          </div>
        </div>
        <div style="text-align: right; margin-left: 20px;">
          <div style="font-weight: 700; color: #111827; font-size: 20px; margin-bottom: 4px;">$${(item.price * item.quantity).toFixed(2)}</div>
          <div style="color: #6b7280; font-size: 14px;">$${item.price.toFixed(2)} each</div>
        </div>
      </div>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Order Confirmation - ${orderNumber}</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; margin: 0 !important; padding: 10px !important; }
              .card { margin: 10px 0 !important; }
              .two-columns { flex-direction: column !important; gap: 10px !important; }
              .two-columns > div { flex: none !important; width: 100% !important; }
              .progress-bar { padding: 20px 10px !important; }
              .progress-steps { flex-direction: column !important; gap: 15px !important; }
              .progress-line { display: none !important; }
              .product-item { flex-direction: column !important; text-align: center !important; }
              .product-image { margin: 0 auto 15px auto !important; }
              .category-nav { flex-direction: column !important; gap: 5px !important; }
              .shop-info { flex-direction: column !important; text-align: center !important; gap: 15px !important; }
              h1 { font-size: 24px !important; }
              .view-order-btn { padding: 15px 20px !important; font-size: 16px !important; }
            }
            
            .icon-checkmark {
              background: #22c55e;
              color: white;
              border-radius: 50%;
              width: 32px;
              height: 32px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 16px;
            }
            
            .icon-pending {
              background: #e5e7eb;
              color: #6b7280;
              border-radius: 50%;
              width: 32px;
              height: 32px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
            }
            
            .progress-step.active .icon-pending {
              background: #3AAEE0;
              color: white;
            }
          </style>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; background-color: #f9fafb;">
          
          <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            
            <!-- Header with Logo -->
            <div class="card" style="text-align: center; margin-bottom: 30px; padding: 40px 20px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="font-size: 36px; font-weight: 700; background: linear-gradient(135deg, #3AAEE0, #2563eb); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 10px; letter-spacing: -0.5px;">
                💎 Jewelry Port
              </div>
              <div class="category-nav" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 20px; color: #6b7280; font-size: 14px; font-weight: 500;">
                <span style="padding: 4px 8px; background: #f3f4f6; border-radius: 16px;">Rings</span>
                <span style="color: #d1d5db;">•</span>
                <span style="padding: 4px 8px; background: #f3f4f6; border-radius: 16px;">Necklaces</span>
                <span style="color: #d1d5db;">•</span>
                <span style="padding: 4px 8px; background: #f3f4f6; border-radius: 16px;">Earrings</span>
                <span style="color: #d1d5db;">•</span>
                <span style="padding: 4px 8px; background: #f3f4f6; border-radius: 16px;">Bracelets</span>
              </div>
            </div>

            <!-- Celebration Header -->
            <div class="card" style="text-align: center; margin-bottom: 30px; background: white; padding: 50px 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="font-size: 48px; margin-bottom: 20px; line-height: 1;">🎉</div>
              <h1 style="color: #111827; margin: 0 0 15px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Order Confirmed!</h1>
              <p style="font-size: 18px; color: #6b7280; margin: 15px 0; line-height: 1.5;">
                Thank you, <strong style="color: #374151;">${customerName}</strong>! Your order is being prepared with care.<br>
                <span style="color: #3AAEE0; font-weight: 600;">Jewelry Port</span> will keep you updated every step of the way.
              </p>
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; border-radius: 8px; margin-top: 25px;">
                <span style="color: #0369a1; font-weight: 600; font-size: 16px;">Order #${orderNumber}</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="card progress-bar" style="background: white; padding: 40px 30px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h2 style="margin: 0 0 30px 0; color: #111827; font-size: 20px; font-weight: 600; text-align: center;">Order Progress</h2>
              <div class="progress-steps" style="display: flex; align-items: center; justify-content: space-between; position: relative;">
                
                <!-- Progress line -->
                <div class="progress-line" style="position: absolute; top: 16px; left: 16px; right: 16px; height: 3px; background: #e5e7eb; z-index: 1;"></div>
                <div class="progress-line" style="position: absolute; top: 16px; left: 16px; width: 33%; height: 3px; background: linear-gradient(90deg, #22c55e, #3AAEE0); z-index: 2;"></div>
                
                <!-- Step 1: Ordered -->
                <div class="progress-step active" style="text-align: center; z-index: 3; position: relative; background: white; padding: 0 10px;">
                  <div class="icon-checkmark" style="margin: 0 auto 12px;">
                    ✓
                  </div>
                  <div style="font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px;">Order Placed</div>
                  <div style="font-size: 12px; color: #6b7280;">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                
                <!-- Step 2: Processing -->
                <div class="progress-step" style="text-align: center; z-index: 3; position: relative; background: white; padding: 0 10px;">
                  <div class="icon-pending" style="margin: 0 auto 12px;">
                    ⚡
                  </div>
                  <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 4px;">Processing</div>
                  <div style="font-size: 12px; color: #9ca3af;">1-2 business days</div>
                </div>
                
                <!-- Step 3: Shipped -->
                <div class="progress-step" style="text-align: center; z-index: 3; position: relative; background: white; padding: 0 10px;">
                  <div class="icon-pending" style="margin: 0 auto 12px;">
                    🚚
                  </div>
                  <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 4px;">Shipped</div>
                  <div style="font-size: 12px; color: #9ca3af;">Est. ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
                
                <!-- Step 4: Delivered -->
                <div class="progress-step" style="text-align: center; z-index: 3; position: relative; background: white; padding: 0 10px;">
                  <div class="icon-pending" style="margin: 0 auto 12px;">
                    📦
                  </div>
                  <div style="font-size: 14px; font-weight: 600; color: #6b7280; margin-bottom: 4px;">Delivered</div>
                  <div style="font-size: 12px; color: #9ca3af;">Est. ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 40px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
              <a href="https://jewelryport.com/orders/${orderNumber}" class="view-order-btn" style="display: inline-block; background: linear-gradient(135deg, #3AAEE0, #2563eb); color: white; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                📋 Track Your Order
              </a>
              <a href="https://jewelryport.com/support" style="display: inline-block; background: white; color: #374151; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 16px; border: 2px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                💬 Get Help
              </a>
            </div>

            <!-- Order Details -->
            <div class="card" style="background: white; padding: 0; border-radius: 12px; margin-bottom: 30px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px 30px; border-bottom: 1px solid #e5e7eb;">
                <h2 style="margin: 0; font-size: 22px; color: #111827; font-weight: 700;">Order Details</h2>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 16px;">
                  Confirmation: <strong style="color: #374151; font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${orderNumber}</strong>
                </p>
              </div>
              
              <div style="padding: 0;">
                ${itemsHtml}
              </div>
            </div>

            <!-- Shipping and Payment Info -->
            <div class="two-columns" style="display: flex; gap: 20px; margin-bottom: 30px;">
              <div style="flex: 1; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                  <span style="font-size: 20px; margin-right: 10px;">📍</span>
                  <h3 style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">Shipping Address</h3>
                </div>
                <div style="color: #6b7280; line-height: 1.6; font-size: 16px;">
                  <div style="font-weight: 600; color: #374151; margin-bottom: 5px;">${shippingAddress?.fullName || customerName}</div>
                  ${shippingAddress?.address}<br>
                  ${shippingAddress?.city}, ${shippingAddress?.state} ${shippingAddress?.zipCode}<br>
                  <div style="margin-top: 5px; font-weight: 500;">${shippingAddress?.country}</div>
                </div>
              </div>
              
              <div style="flex: 1; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                  <span style="font-size: 20px; margin-right: 10px;">💳</span>
                  <h3 style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">Payment Summary</h3>
                </div>
                <div style="margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px;">
                    <span style="color: #6b7280;">Subtotal</span>
                    <span style="color: #374151; font-weight: 500;">$${(orderTotal * 0.85).toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px;">
                    <span style="color: #6b7280;">Tax</span>
                    <span style="color: #374151; font-weight: 500;">$${(orderTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px;">
                    <span style="color: #6b7280;">Shipping</span>
                    <span style="color: #374151; font-weight: 500;">$${(orderTotal * 0.07).toFixed(2)}</span>
                  </div>
                  <div style="color: #6b7280; font-size: 13px; margin-top: 8px; padding: 8px; background: #f9fafb; border-radius: 6px;">
                    🚚 Standard Shipping (5-7 business days)
                  </div>
                </div>
                <div style="border-top: 2px solid #e5e7eb; padding-top: 15px;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 20px; color: #111827;">
                    <span>Total (${orderItems.length} item${orderItems.length > 1 ? 's' : ''})</span>
                    <span style="color: #3AAEE0;">$${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Eco-Friendly Info -->
            <div class="card" style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center; border: 1px solid #bbf7d0;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap;">
                <span style="font-size: 24px;">🌱</span>
                <span style="color: #166534; font-size: 16px; font-weight: 600;">Carbon-Neutral Shipping</span>
                <span style="color: #16a34a; font-size: 14px;">• Eco-friendly packaging • Sustainable practices</span>
              </div>
            </div>

            <!-- Shop Information -->
            <div class="card" style="background: white; padding: 40px 30px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h2 style="margin: 0 0 25px 0; color: #111827; font-size: 22px; font-weight: 700;">About Jewelry Port</h2>
              <div class="shop-info" style="display: flex; align-items: center; gap: 20px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3AAEE0, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);">
                  JP
                </div>
                <div style="flex: 1;">
                  <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 20px; font-weight: 700;">Jewelry Port</h3>
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 16px;">Premium Handcrafted Jewelry</p>
                  <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">Trusted by thousands of satisfied customers worldwide</p>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #fbbf24; font-size: 18px;">⭐⭐⭐⭐⭐</span>
                    <span style="color: #6b7280; font-size: 14px; font-weight: 500;">4.9/5 (2,847 reviews)</span>
                  </div>
                </div>
                <div style="text-align: right;">
                  <a href="mailto:support@jewelryport.com" style="display: inline-block; background: linear-gradient(135deg, #111827, #374151); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-size: 14px; font-weight: 600; margin-bottom: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                    📧 Contact Support
                  </a>
                  <div style="font-size: 12px; color: #9ca3af;">
                    Response within 2 hours
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 50px; padding: 30px 20px; border-top: 2px solid #e5e7eb; background: white; border-radius: 12px;">
              <div style="margin-bottom: 20px;">
                <a href="https://jewelryport.com" style="color: #3AAEE0; text-decoration: none; font-weight: 600; margin: 0 15px;">Visit Store</a>
                <a href="https://jewelryport.com/returns" style="color: #6b7280; text-decoration: none; margin: 0 15px;">Returns</a>
                <a href="https://jewelryport.com/privacy" style="color: #6b7280; text-decoration: none; margin: 0 15px;">Privacy</a>
                <a href="https://jewelryport.com/terms" style="color: #6b7280; text-decoration: none; margin: 0 15px;">Terms</a>
              </div>
              <p style="color: #9ca3af; font-size: 14px; margin: 0; line-height: 1.5;">
                © 2024 Jewelry Port. All rights reserved.<br>
                Questions? Email us at <a href="mailto:support@jewelryport.com" style="color: #3AAEE0; text-decoration: none;">support@jewelryport.com</a>
              </p>
            </div>
            
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