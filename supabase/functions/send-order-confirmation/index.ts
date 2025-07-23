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
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; text-align: left;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - ${orderNumber}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3AAEE0; margin-bottom: 10px;">Order Confirmed!</h1>
            <p style="font-size: 18px; color: #666;">Thank you for your order, ${customerName}!</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-top: 0;">Order Details</h2>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Order Total:</strong> $${orderTotal.toFixed(2)}</p>
            <p><strong>Status:</strong> Processing</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #333;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background: #3AAEE0; color: white;">
                  <th style="padding: 12px; text-align: left;">Item</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Price</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
            <p>${shippingAddress?.fullName || customerName}<br>
            ${shippingAddress?.address}<br>
            ${shippingAddress?.city}, ${shippingAddress?.state} ${shippingAddress?.zipCode}<br>
            ${shippingAddress?.country}</p>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <p style="color: #666;">We'll send you another email when your order ships.</p>
            <p style="color: #666;">Questions? Contact us at support@jewelryport.com</p>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">© 2024 Jewelry Port. All rights reserved.</p>
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