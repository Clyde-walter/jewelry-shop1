import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShippingAlertRequest {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingCarrier?: string;
}

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Your order has been confirmed and is being prepared for shipment.';
    case 'processing':
      return 'Your order is currently being processed.';
    case 'shipped':
      return 'Great news! Your order has been shipped and is on its way to you.';
    case 'in_transit':
      return 'Your order is currently in transit and will arrive soon.';
    case 'delivered':
      return 'Your order has been delivered! We hope you love your new jewelry.';
    case 'cancelled':
      return 'Your order has been cancelled. If you have any questions, please contact us.';
    default:
      return 'Your order status has been updated.';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
    case 'processing':
      return '#3AAEE0';
    case 'shipped':
    case 'in_transit':
      return '#10B981';
    case 'delivered':
      return '#059669';
    case 'cancelled':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerName,
      customerEmail,
      orderNumber,
      status,
      trackingNumber,
      estimatedDelivery,
      shippingCarrier
    }: ShippingAlertRequest = await req.json();

    console.log('Sending shipping alert email for:', orderNumber, 'Status:', status);

    const statusMessage = getStatusMessage(status);
    const statusColor = getStatusColor(status);
    const trackingSection = trackingNumber ? `
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Tracking Information</h3>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        ${shippingCarrier ? `<p><strong>Carrier:</strong> ${shippingCarrier}</p>` : ''}
        ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>` : ''}
      </div>
    ` : '';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Update - ${orderNumber}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3AAEE0; margin-bottom: 10px;">Order Update</h1>
            <p style="font-size: 18px; color: #666;">Hi ${customerName},</p>
          </div>
          
          <div style="background: ${statusColor}; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
            <h2 style="margin: 0; text-transform: capitalize;">${status.replace('_', ' ')}</h2>
            <p style="margin: 10px 0 0 0; font-size: 16px;">${statusMessage}</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Current Status:</strong> ${status.replace('_', ' ').toUpperCase()}</p>
          </div>

          ${trackingSection}

          <div style="text-align: center; margin-top: 40px;">
            ${status === 'shipped' || status === 'in_transit' ? 
              '<p style="color: #666;">You can track your package using the tracking number above.</p>' : ''
            }
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
      subject: `Order ${status.replace('_', ' ').toUpperCase()} - ${orderNumber}`,
      html: emailHtml,
    });

    console.log("Shipping alert email sent successfully:", emailResponse);

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
    console.error("Error sending shipping alert email:", error);
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