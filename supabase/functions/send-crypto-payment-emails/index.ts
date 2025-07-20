import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'pending' | 'confirmed';
  customerName: string;
  customerEmail: string;
  orderId: string;
  amount: number;
  walletAddress: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, customerName, customerEmail, orderId, amount, walletAddress }: EmailRequest = await req.json();

    let subject: string;
    let html: string;

    if (type === 'pending') {
      subject = "Crypto Payment Confirmation Pending";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Payment Received - Awaiting Confirmation</h2>
          <p>Dear ${customerName},</p>
          <p>Thank you for your cryptocurrency payment! We have received your order and are currently verifying your payment.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Wallet Address:</strong> ${walletAddress}</p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0;"><strong>What's Next?</strong></p>
            <p style="margin: 5px 0 0 0;">Our team is verifying your cryptocurrency payment. This process typically takes 15-30 minutes depending on network confirmation times. You will receive another email once your payment is confirmed and your order is processed.</p>
          </div>
          
          <p style="margin-top: 30px;">If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>Your Store Team</p>
        </div>
      `;
    } else {
      subject = "Crypto Payment Confirmed - Order Processing";
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Payment Confirmed! 🎉</h2>
          <p>Dear ${customerName},</p>
          <p>Great news! Your cryptocurrency payment has been successfully confirmed and your order is now being processed.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmed & Processing</span></p>
          </div>
          
          <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
            <p style="margin: 0;"><strong>What's Next?</strong></p>
            <p style="margin: 5px 0 0 0;">Your order is now in our fulfillment queue and will be prepared for shipping. You'll receive tracking information once your order ships.</p>
          </div>
          
          <p style="margin-top: 30px;">Thank you for choosing us for your purchase!</p>
          <p>Best regards,<br>Your Store Team</p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Store <onboarding@resend.dev>",
      to: [customerEmail],
      subject: subject,
      html: html,
    });

    console.log("Crypto payment email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-crypto-payment-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);