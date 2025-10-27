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
  
  if (!data.company || data.company.trim().length === 0 || data.company.length > 200) {
    errors.push("Company name must be between 1 and 200 characters");
  }
  
  if (!data.package_interest || data.package_interest.trim().length === 0) {
    errors.push("Package interest is required");
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
    console.log("[SPONSORSHIP-INQUIRY] Function started");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const emailFrom = Deno.env.get("EMAIL_FROM") || "UXSG <onboarding@resend.dev>";

    // Parse request body
    const body = await req.json();
    console.log("[SPONSORSHIP-INQUIRY] Request received:", { 
      name: body.name, 
      email: body.email, 
      company: body.company,
      package: body.package_interest 
    });

    // Validate input
    const validationErrors = validateInquiry(body);
    if (validationErrors.length > 0) {
      console.error("[SPONSORSHIP-INQUIRY] Validation failed:", validationErrors);
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
      .from("sponsorship_inquiries")
      .insert({
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        company: body.company.trim(),
        package_interest: body.package_interest,
        message: body.message.trim(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("[SPONSORSHIP-INQUIRY] Database error:", dbError);
      throw new Error("Failed to save inquiry");
    }

    console.log("[SPONSORSHIP-INQUIRY] Inquiry saved:", inquiry.id);

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: emailFrom,
        to: [body.email],
        subject: "We received your sponsorship inquiry!",
        html: `
          <h1>Thank you for your interest, ${body.name}!</h1>
          <p>We've received your sponsorship inquiry and will be in touch within 24 hours.</p>
          
          <h2>Your Inquiry Details:</h2>
          <ul>
            <li><strong>Company:</strong> ${body.company}</li>
            <li><strong>Package Interest:</strong> ${body.package_interest}</li>
            <li><strong>Message:</strong> ${body.message}</li>
          </ul>
          
          <p>If you have any questions in the meantime, feel free to reach out to us at info@uxsupportgroup.com</p>
          
          <p>Best regards,<br>The UXSG Team</p>
        `,
      });
      console.log("[SPONSORSHIP-INQUIRY] Confirmation email sent to user");
    } catch (emailError) {
      console.error("[SPONSORSHIP-INQUIRY] Failed to send confirmation email:", emailError);
      // Don't fail the request if confirmation email fails
    }

    // Send notification email to team
    try {
      await resend.emails.send({
        from: emailFrom,
        to: ["info@uxsupportgroup.com"],
        cc: ["dnystwn@gmail.com"],
        subject: `New Sponsorship Inquiry: ${body.package_interest}`,
        html: `
          <h1>New Sponsorship Inquiry Received</h1>
          
          <h2>Contact Information:</h2>
          <ul>
            <li><strong>Name:</strong> ${body.name}</li>
            <li><strong>Email:</strong> ${body.email}</li>
            <li><strong>Company:</strong> ${body.company}</li>
          </ul>
          
          <h2>Package Interest:</h2>
          <p>${body.package_interest}</p>
          
          <h2>Message:</h2>
          <p>${body.message}</p>
          
          <hr>
          <p><small>Inquiry ID: ${inquiry.id}</small></p>
          <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
        `,
      });
      console.log("[SPONSORSHIP-INQUIRY] Notification email sent to team");
    } catch (emailError) {
      console.error("[SPONSORSHIP-INQUIRY] Failed to send notification email:", emailError);
      // Don't fail the request if notification email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Inquiry submitted successfully",
        inquiryId: inquiry.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("[SPONSORSHIP-INQUIRY] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
