import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

interface WelcomeEmailRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  confirmationUrl?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, firstName, lastName, confirmationUrl }: WelcomeEmailRequest = await req.json();

    console.log('Processing welcome email request for:', email);

    const displayName = firstName ? `${firstName}${lastName ? ` ${lastName}` : ''}` : email.split('@')[0];

    // Get welcome email template from database
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('type', 'welcome')
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .limit(1)
      .maybeSingle();

    let emailContent: string;
    let emailSubject: string;

    if (template) {
      // Use template from database
      emailSubject = template.subject.replace(/{{user_name}}/g, displayName);
      emailContent = template.content
        .replace(/{{user_name}}/g, displayName)
        .replace(/{{user_email}}/g, email);
      
      if (confirmationUrl) {
        emailContent = emailContent.replace(/{{confirmation_url}}/g, confirmationUrl);
      }
    } else {
      // Default welcome email template
      emailSubject = `Welcome to Jewelry Port, ${displayName}!`;
      emailContent = `
        <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <!--[if !mso]><!-->
          <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
          <title></title>
          <style type="text/css">
            @media only screen and (min-width: 520px) {
              .u-row {
                width: 500px !important;
              }
              .u-row .u-col {
                vertical-align: top;
              }
              .u-row .u-col-100 {
                width: 500px !important;
              }
            }
            @media only screen and (max-width: 520px) {
              .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
              }
              .u-row {
                width: 100% !important;
              }
              .u-row .u-col {
                display: block !important;
                width: 100% !important;
                min-width: 320px !important;
                max-width: 100% !important;
              }
              .u-row .u-col>div {
                margin: 0 auto;
              }
              .u-row .u-col img {
                max-width: 100% !important;
              }
            }
            body {
              margin: 0;
              padding: 0
            }
            table,
            td,
            tr {
              border-collapse: collapse;
              vertical-align: top
            }
            p {
              margin: 0
            }
            .ie-container table,
            .mso-container table {
              table-layout: fixed
            }
            * {
              line-height: inherit
            }
            a[x-apple-data-detectors=true] {
              color: inherit !important;
              text-decoration: none !important
            }
            table,
            td {
              color: #000000;
            }
            #u_body a {
              color: #0000ee;
              text-decoration: underline;
            }
            @media (max-width: 480px) {
              #u_content_image_2 .v-src-width {
                width: 49% !important;
              }
              #u_content_image_2 .v-src-max-width {
                max-width: 49% !important;
              }
            }
          </style>
        </head>
        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9F9;color: #000000">
          <!--[if IE]><div class="ie-container"><![endif]-->
          <!--[if mso]><div class="mso-container"><![endif]-->
          <table role="presentation" id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9F9;width:100%" cellpadding="0" cellspacing="0">
            <tbody>
              <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                  <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #F9F9F9;"><![endif]-->
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                        <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                          <div style="height: 100%;width: 100% !important;">
                            <!--[if (!mso)&(!IE)]><!-->
                            <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                              <table id="u_content_image_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                          <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                            <img align="center" border="0" src="https://assets.unlayer.com/projects/275263/1751134560914-small.png?w=240px" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 25%;max-width: 120px;" width="120" class="v-src-width v-src-max-width" />
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <!--[if mso]><table role="presentation" width="100%"><tr><td><![endif]-->
                                      <h1 style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 22px; font-weight: 400;"><strong>Welcome to Jewelry Port, ${displayName}!!!</strong></h1>
                                      <!--[if mso]></td></tr></table><![endif]-->
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                        <p style="line-height: 140%;">We're thrilled to have you dock at Jewelry Port – your haven for exquisite, handcrafted treasures designed to tell <em>your story.</em></p>
                                        <p style="line-height: 140%;">&nbsp;</p>
                                        <p style="line-height: 140%;">As a special welcome, here's 10% off your first order (use code <span style="color: rgb(58, 174, 224); line-height: 19.6px;"><strong>WELCOME10</strong></span> at checkout). Consider it our way of saying, "<em>Happy sailing!</em>" 🛳️💎</p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                        <p style="line-height: 140%;"><span style="color: rgb(58, 174, 224); line-height: 19.6px;"><strong>Why anchor here?</strong></span><br>🔹 <span style="color: rgb(58, 174, 224); line-height: 19.6px;"><strong>Curated Collections</strong></span> – From ocean-inspired elegance to timeless classics.<br>🔹 <span style="color: rgb(58, 174, 224); line-height: 19.6px;"><strong>Ethically Crafted</strong></span> – Each piece is responsibly sourced.<br>🔹 <span style="color: rgb(58, 174, 224); line-height: 19.6px;"><strong>Free Shipping</strong></span> – On all orders over $1000.</p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              ${confirmationUrl ? `
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                      <div align="center">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${confirmationUrl}" style="height:37px; v-text-anchor:middle; width:175px;" arcsize="11%"  stroke="f" fillcolor="#3AAEE0"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                        <a href="${confirmationUrl}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3AAEE0; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                          <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">Verify Your Email</span></span>
                                        </a>
                                        <!--[if mso]></center></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              ` : `
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                      <div align="center">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.jewelryport.com/products" style="height:37px; v-text-anchor:middle; width:175px;" arcsize="11%"  stroke="f" fillcolor="#3AAEE0"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                        <a href="https://www.jewelryport.com/products" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3AAEE0; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                          <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 16.8px;">Explore our Products.</span></span>
                                        </a>
                                        <!--[if mso]></center></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              `}
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                        <p style="margin-bottom: 25px; color: rgb(85, 85, 85); white-space: normal; line-height: 140%;">P.S. Follow us <span style="color: rgb(58, 174, 224); line-height: 19.6px;"><strong>@JewelryPort</strong></span> for exclusive drops, styling tips, and a dose of sparkle! 💫</p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                        <p style="margin-bottom: 25px; color: rgb(85, 85, 85); white-space: normal; line-height: 140%;"><strong>With Love</strong></p>
                                        <p style="margin-bottom: 25px; color: rgb(85, 85, 85); white-space: normal; line-height: 140%;">The Jewelry Port Crew</p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                        <p style="line-height: 140%;"><span style="color: rgb(85, 85, 85); text-align: center; white-space: normal; background-color: rgb(248, 245, 242); float: none; display: inline; line-height: 19.6px;">© 2024 JewelryPort. All rights reserved.</span></p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                        <p style="line-height: 140%;"><a style="text-align: center; white-space: normal; background-color: rgb(248, 245, 242); color: rgb(153, 153, 153); text-decoration-line: none;" href="https://jewelryport.com/privacy">Privacy Policy</a><span style="color: rgb(85, 85, 85); text-align: center; white-space: normal; background-color: rgb(248, 245, 242); float: none; display: inline; line-height: 19.6px;">&nbsp;| </span><a style="text-align: center; white-space: normal; background-color: rgb(248, 245, 242); color: rgb(153, 153, 153); text-decoration-line: none;" href="https://jewelryport.com/terms">Terms of Service</a><span style="color: rgb(85, 85, 85); text-align: center; white-space: normal; background-color: rgb(248, 245, 242); float: none; display: inline; line-height: 19.6px;">&nbsp;|&nbsp;</span><a style="text-align: center; white-space: normal; background-color: rgb(248, 245, 242); color: rgb(153, 153, 153); text-decoration-line: none;" href="https://jewelryport.com/contact">Contact Us</a></p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <div style="font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                                        <p style="line-height: 140%;"><span style="color: rgb(85, 85, 85); text-align: center; white-space: normal; background-color: rgb(248, 245, 242); float: none; display: inline; line-height: 19.6px;">JewelryPort, 123 Luxury Lane, Gemstone City</span></p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if (!mso)&(!IE)]><!-->
                            </div><!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                      </div>
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
          <!--[if mso]></div><![endif]-->
          <!--[if IE]></div><![endif]-->
        </body>
        </html>
      `;
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: 'Jewelry Port <welcome@jewelryport.com>',
      to: [email],
      subject: emailSubject,
      html: emailContent,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    // Log email to history
    const { error: historyError } = await supabase
      .from('email_history')
      .insert({
        template_id: template?.id || null,
        recipient_type: 'custom',
        recipient_email: email,
        subject: emailSubject,
        content: emailContent,
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata: { 
          type: 'welcome',
          firstName,
          lastName,
          emailId: emailResponse.data?.id
        }
      });

    if (historyError) {
      console.error('Error saving email history:', historyError);
    }

    console.log('Welcome email sent successfully via Resend:', emailResponse.data);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Welcome email sent successfully',
        emailId: emailResponse.data?.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in welcome email function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});