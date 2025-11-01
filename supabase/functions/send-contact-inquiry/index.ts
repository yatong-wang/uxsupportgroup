import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple validation helper
const validateInquiry = (data: any) => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length === 0 || data.name.length > 100) {
    errors.push("Name must be between 1 and 100 characters");
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email) || data.email.length > 255) {
    errors.push("Valid email address required (max 255 characters)");
  }
  
  if (!data.message || data.message.trim().length < 10 || data.message.length > 2000) {
    errors.push("Message must be between 10 and 2000 characters");
  }
  
  return errors;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CONTACT-INQUIRY] Function started");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const emailFrom = Deno.env.get("EMAIL_FROM") || "UXSG <onboarding@resend.dev>";

    // Parse request body
    const body = await req.json();
    console.log("[CONTACT-INQUIRY] Request received:", { 
      name: body.name, 
      email: body.email
    });

    // Validate input
    const validationErrors = validateInquiry(body);
    if (validationErrors.length > 0) {
      console.error("[CONTACT-INQUIRY] Validation failed:", validationErrors);
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validationErrors }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Store in database
    const { data: inquiry, error: dbError } = await supabase
      .from("contact_inquiries")
      .insert({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        message: body.message.trim(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("[CONTACT-INQUIRY] Database error:", dbError);
      throw new Error("Failed to save inquiry");
    }

    console.log("[CONTACT-INQUIRY] Inquiry saved:", inquiry.id);

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: emailFrom,
        to: [body.email],
        subject: "We received your message!",
        html: `
          <h1>Thank you for reaching out, ${body.name}!</h1>
          <p>We've received your message and will get back to you as soon as possible.</p>
          
          <h2>Your Message:</h2>
          <p>${body.message}</p>
          
          <p>If you have any urgent questions, feel free to reach out to us at info@uxsupportgroup.com</p>
          
          <p>Best regards,<br>The UXSG Team</p>
        `,
      });
      console.log("[CONTACT-INQUIRY] Confirmation email sent to user");
    } catch (emailError) {
      console.error("[CONTACT-INQUIRY] Failed to send confirmation email:", emailError);
      // Don't fail the request if confirmation email fails
    }

    // Send notification email to team
    try {
      await resend.emails.send({
        from: emailFrom,
        to: ["info@uxsupportgroup.com"],
        cc: ["dnystwn@gmail.com"],
        subject: `New Contact Inquiry from ${body.name}`,
        html: `
          <h1>New Contact Inquiry Received</h1>
          
          <h2>Contact Information:</h2>
          <ul>
            <li><strong>Name:</strong> ${body.name}</li>
            <li><strong>Email:</strong> ${body.email}</li>
          </ul>
          
          <h2>Message:</h2>
          <p>${body.message}</p>
          
          <hr>
          <p><small>Inquiry ID: ${inquiry.id}</small></p>
          <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
        `,
      });
      console.log("[CONTACT-INQUIRY] Notification email sent to team");
    } catch (emailError) {
      console.error("[CONTACT-INQUIRY] Failed to send notification email:", emailError);
      // Don't fail the request if notification email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message sent successfully",
        inquiryId: inquiry.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("[CONTACT-INQUIRY] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
