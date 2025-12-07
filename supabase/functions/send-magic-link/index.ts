import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_FROM = Deno.env.get("EMAIL_FROM") || "UX Support Group <info@uxsupportgroup.com>";
const PUBLIC_SITE_URL = Deno.env.get("PUBLIC_SITE_URL") || "https://uxsupportgroup.com";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate secure random token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // Store magic link token
    await supabase.from("magic_link_tokens").insert({
      token,
      email,
      user_id: existingProfile?.id || null,
      expires_at: expiresAt.toISOString(),
    });

    // Send email via Resend
    const magicLink = `${PUBLIC_SITE_URL}/summit-profiles/verify?token=${token}`;

    console.log("[SEND-MAGIC-LINK] Preparing to send email", {
      to: email,
      from: EMAIL_FROM,
      magicLink,
    });

    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: [email],
        subject: "Your Magic Link to Create/Edit Your Profile Card - UXSG",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Magic Link - UX Support Group</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #E8E5F0; line-height: 1.6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #E8E5F0; padding: 20px 0;">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header - Matching Modal Profile Card Style -->
                    <tr>
                      <td style="padding: 40px 40px 0; background-color: #FFFFFF; border-radius: 8px 8px 0 0;">
                        <!-- Logo and Title Row - Matching Modal Style -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 0 0 40px 0;">
                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                  <td style="padding: 0; vertical-align: middle;">
                                    <table role="presentation" style="border-collapse: collapse;">
                                      <tr>
                                        <td style="padding: 0; vertical-align: middle;">
                                          <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDE0cHgiIGhlaWdodD0iMTM1cHgiIHZpZXdCb3g9IjAgMCA0MTQgMTM1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA2MC4xICg4ODEzMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+VVhTRy1sb2dvLWhvcjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPgogICAgICAgIDxwb2x5Z29uIGlkPSJwYXRoLTEiIHBvaW50cz0iMTE0IDAgMTIwIDYgMTIwIDExOSA1IDExOSAwIDExNCAxIDk2IDEgMSA5NiAxIj48L3BvbHlnb24+CiAgICAgICAgPHBvbHlnb24gaWQ9InBhdGgtMyIgcG9pbnRzPSIxMTQgMCAxMjAgNiAxMjAgMTIwIDYgMTIwIDAgMTE0IDEgOTYgMSAxIDk2IDEiPjwvcG9seWdvbj4KICAgICAgICA8cG9seWdvbiBpZD0icGF0aC01IiBwb2ludHM9IjExNCAwIDEyMCA2IDEyMCAxMjAgNiAxMjAgMCAxMTQgMSA5NiAxIDEgOTYgMSI+PC9wb2x5Z29uPgogICAgICAgIDxwYXRoIGQ9Ik0xMTQsMCBMMTE0LDc2LjEyMiBDMTE0LDgxLjQ1NCAxMTEuODE5LDg2LjU1NCAxMDcuOTYzLDkwLjIzNyBMODguNzQ1LDEwOC41OTUgQzg1LjExNCwxMTIuMDY0IDgwLjI4NCwxMTQgNzUuMjYyLDExNCBMMCwxMTQgTDAsMCBMMTE0LDAgWiIgaWQ9InBhdGgtNyI+PC9wYXRoPgogICAgICAgIDxwYXRoIGQ9Ik0xMTQsMCBMMTE0LDc2LjMxMSBDMTE0LDgwLjc5NyAxMTAuMzI3LDg0LjQxMyAxMDUuODQyLDg0LjM0MyBMODQsODQgTDgzLjMyNCwxMDYuMjEyIEM4My4xOTIsMTEwLjU1MSA3OS42MzYsMTE0IDc1LjI5NSwxMTQgTDAsMTE0IEwwLDAgTDExNCwwIFoiIGlkPSJwYXRoLTkiPjwvcGF0aD4KICAgICAgICA8cGF0aCBkPSJNMTAuMzc5LDAgTDEwLjM3OSwyMC41MjMgQzEwLjM3OSwyNS44NTEgMTMuMDY1LDI4LjM4MyAxNy4xNzUsMjguMzgzIEMyMS4yODQsMjguMzgzIDIzLjk3MiwyNS45NTcgMjMuOTcyLDIwLjc4NiBMMjMuOTcyLDIwLjc4NiBMMjMuOTcyLDAgTDM0LjM1MSwwIEwzNC4zNTEsMjAuNDcgQzM0LjM1MSwyMy41MzYgMzMuODk0LDI2LjE1MiAzMy4wNDksMjguMzU3IEwzMy4wNDksMjguMzU3IEwzOS40MDEsMzguNDY0IEw0NS45ODgsMjguMDcxIEw1Ny40NzMsMjguMDcxIEw0NS4zNTYsNDYuMTE0IEw1OCw2NSBMNDYuMjUxLDY1IEwzOS4xOTEsNTMuODY5IEwzMi4wNzgsNjUgTDIwLjU5Myw2NSBMMzMuMjM3LDQ2LjIyIEwyNi4yNjMsMzUuNzczIEMyMy42ODksMzcuMDEgMjAuNTk1LDM3LjYxNiAxNy4wNywzNy42MTYgQzYuNTg2LDM3LjYxNiAwLDMyLjI4NyAwLDIwLjczMyBMMCwyMC43MzMgTDAsMCBMMTAuMzc5LDAgWiIgaWQ9InBhdGgtMTEiPjwvcGF0aD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJVWFNHLWxvZ28taG9yIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iR3JvdXAtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUuMDAwMDAwLCAxNi4wMDAwMDApIj4KICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICA8ZyBpZD0iQ2xpcC0yIj48L2c+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJGaWxsLTEiIGZpbGw9IiM2MUM0RDgiIG1hc2s9InVybCgjbWFzay0yKSIgcG9pbnRzPSIwIDExOSAxMjAgMTE5IDEyMCAtMC4wNCAwIC0wLjA0Ij48L3BvbHlnb24+CiAgICAgICAgPC9nPgogICAgICAgIDxnIGlkPSJHcm91cC02IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5LjAwMDAwMCwgMTAuMDAwMDAwKSI+CiAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTQiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMyI+PC91c2U+CiAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgPGcgaWQ9IkNsaXAtNSI+PC9nPgogICAgICAgICAgICA8cG9seWdvbiBpZD0iRmlsbC00IiBmaWxsPSIjQTI5MUI5IiBtYXNrPSJ1cmwoI21hc2stNCkiIHBvaW50cz0iMCAxMjAuMDggMTIwIDEyMC4wOCAxMjAgLTAuMDQgMCAtMC4wNCI+PC9wb2x5Z29uPgogICAgICAgIDwvZz4KICAgICAgICA8ZyBpZD0iR3JvdXAtOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4wMDAwMDAsIDQuMDAwMDAwKSI+CiAgICAgICAgICAgIDxtYXNrIGlkPSJtYXNrLTYiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtNSI+PC91c2U+CiAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgPGcgaWQ9IkNsaXAtOCI+PC9nPgogICAgICAgICAgICA8cG9seWdvbiBpZD0iRmlsbC03IiBmaWxsPSIjRkNERDJBIiBtYXNrPSJ1cmwoI21hc2stNikiIHBvaW50cz0iMCAxMjAuMDggMTIwIDEyMC4wOCAxMjAgLTAuMDQgMCAtMC4wNCI+PC9wb2x5Z29uPgogICAgICAgIDwvZz4KICAgICAgICA8ZyBpZD0iR3JvdXAtMTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuMDAwMDAwLCA0LjAwMDAwMCkiPgogICAgICAgICAgICA8bWFzayBpZD0ibWFzay04IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTciPjwvdXNlPgogICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgIDxnIGlkPSJDbGlwLTExIj48L2c+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJGaWxsLTEwIiBmaWxsPSIjRjVFNzNDIiBtYXNrPSJ1cmwoI21hc2stOCkiIHBvaW50cz0iMCAxMTQuMDggMTE0IDExNC4wOCAxMTQgLTAuMDQgMCAtMC4wNCI+PC9wb2x5Z29uPgogICAgICAgIDwvZz4KICAgICAgICA8ZyBpZD0iR3JvdXAtMTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuMDAwMDAwLCA0LjAwMDAwMCkiPgogICAgICAgICAgICA8bWFzayBpZD0ibWFzay0xMCIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC05Ij48L3VzZT4KICAgICAgICAgICAgPC9tYXNrPgogICAgICAgICAgICA8ZyBpZD0iQ2xpcC0xNCI+PC9nPgogICAgICAgICAgICA8cG9seWdvbiBpZD0iRmlsbC0xMyIgZmlsbD0iI0ZDREQyQSIgbWFzaz0idXJsKCNtYXNrLTEwKSIgcG9pbnRzPSIwIDExNC4wOCAxMTQgMTE0LjA4IDExNCAtMC4wNCAwIC0wLjA0Ij48L3BvbHlnb24+CiAgICAgICAgPC9nPgogICAgICAgIDxnIGlkPSJHcm91cC0xOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYuMDAwMDAwLCAxNy4wMDAwMDApIj4KICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMTEiPjwvdXNlPgogICAgICAgICAgICA8L21hc2s+CiAgICAgICAgICAgIDxnIGlkPSJDbGlwLTE3Ij48L2c+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJGaWxsLTE2IiBmaWxsPSIjMDkwOTA3IiBtYXNrPSJ1cmwoI21hc2stMTIpIiBwb2ludHM9Ii0wLjA0IDY1LjA4IDU4LjA4IDY1LjA4IDU4LjA4IC0wLjA4IC0wLjA0IC0wLjA4Ij48L3BvbHlnb24+CiAgICAgICAgPC9nPgogICAgICAgIDxwYXRoIGQ9Ik0xNjguMzIsNTQuNCBDMTc0LjM2LDU0LjQgMTc4LjYsNTEuMjggMTc4LjYsNDUuNzIgTDE3OC42LDQ1LjY0IEMxNzguNiw0MC43NiAxNzUuNCwzOC43MiAxNjkuNzIsMzcuMjQgQzE2NC44OCwzNiAxNjMuNjgsMzUuNCAxNjMuNjgsMzMuNTYgTDE2My42OCwzMy40OCBDMTYzLjY4LDMyLjEyIDE2NC45MiwzMS4wNCAxNjcuMjgsMzEuMDQgQzE2OS42NCwzMS4wNCAxNzIuMDgsMzIuMDggMTc0LjU2LDMzLjggTDE3Ny43NiwyOS4xNiBDMTc0LjkyLDI2Ljg4IDE3MS40NCwyNS42IDE2Ny4zNiwyNS42IEMxNjEuNjQsMjUuNiAxNTcuNTYsMjguOTYgMTU3LjU2LDM0LjA0IEwxNTcuNTYsMzQuMTIgQzE1Ny41NiwzOS42OCAxNjEuMiw0MS4yNCAxNjYuODQsNDIuNjggQzE3MS41Miw0My44OCAxNzIuNDgsNDQuNjggMTcyLjQ4LDQ2LjI0IEwxNzIuNDgsNDYuMzIgQzE3Mi40OCw0Ny45NiAxNzAuOTYsNDguOTYgMTY4LjQ0LDQ4Ljk2IEMxNjUuMjQsNDguOTYgMTYyLjYsNDcuNjQgMTYwLjA4LDQ1LjU2IEwxNTYuNDQsNDkuOTIgQzE1OS44LDUyLjkyIDE2NC4wOCw1NC40IDE2OC4zMiw1NC40IFogTTE5NC42NCw1NC40NCBDMjAyLjE2LDU0LjQ0IDIwNi45Miw1MC4yOCAyMDYuOTIsNDEuOCBMMjA2LjkyLDI2IEwyMDAuNzYsMjYgTDIwMC43Niw0Mi4wNCBDMjAwLjc2LDQ2LjQ4IDE5OC40OCw0OC43NiAxOTQuNzIsNDguNzYgQzE5MC45Niw0OC43NiAxODguNjgsNDYuNCAxODguNjgsNDEuODQgTDE4OC42OCwyNiBMMTgyLjUyLDI2IEwxODIuNTIsNDIgQzE4Mi41Miw1MC4yNCAxODcuMTIsNTQuNDQgMTk0LjY0LDU0LjQ0IFogTTIxOC4zNiw1NCBMMjE4LjM2LDQ1LjYgTDIyMy4wNCw0NS42IEMyMjkuMzIsNDUuNiAyMzQuMzYsNDIuMjQgMjM0LjM2LDM1Ljc2IEwyMzQuMzYsMzUuNjggQzIzNC4zNiwyOS45NiAyMzAuMzIsMjYgMjIzLjY0LDI2IEwyMTIuMiwyNiBMMjEyLjIsNTQgTDIxOC4zNiw1NCBaIE0yMjMuMjQsNDAuMTIgTDIxOC4zNiw0MC4xMiBMMjE4LjM2LDMxLjU2IEwyMjMuMTIsMzEuNTYgQzIyNi4yLDMxLjU2IDIyOC4xMiwzMy4wNCAyMjguMTIsMzUuOCBMMjI4LjEyLDM1Ljg4IEMyMjguMTIsMzguMjggMjI2LjMyLDQwLjEyIDIyMy4yNCw0MC4xMiBaIE0yNDQuMDgsNTQgTDI0NC4wOCw0NS42IEwyNDguNzYsNDUuNiBDMjU1LjA0LDQ1LjYgMjYwLjA4LDQyLjI0IDI2MC4wOCwzNS43NiBMMjYwLjA4LDM1LjY4IEMyNjAuMDgsMjkuOTYgMjU2LjA0LDI2IDI0OS4zNiwyNiBMMjM3LjkyLDI2IEwyMzcuOTIsNTQgTDI0NC4wOCw1NCBaIE0yNDguOTYsNDAuMTIgTDI0NC4wOCw0MC4xMiBMMjQ0LjA4LDMxLjU2IEwyNDguODQsMzEuNTYgQzI1MS45MiwzMS41NiAyNTMuODQsMzMuMDQgMjUzLjg0LDM1LjggTDI1My44NCwzNS44OCBDMjUzLjg0LDM4LjI4IDI1Mi4wNCw0MC4xMiAyNDguOTYsNDAuMTIgWiBNMjc3LjI0LDU0LjQ4IEMyODUuODgsNTQuNDggMjkyLjE2LDQ3Ljk2IDI5Mi4xNiw0MCBMMjkyLjE2LDM5LjkyIEMyOTIuMTYsMzEuOTYgMjg1Ljk2LDI1LjUyIDI3Ny4zMiwyNS41MiBDMjY4LjY4LDI1LjUyIDI2Mi40LDMyLjA0IDI2Mi40LDQwIEwyNjIuNCw0MC4wOCBDMjYyLjQsNDguMDQgMjY4LjYsNTQuNDggMjc3LjI0LDU0LjQ4IFogTTI3Ny4zMiw0OC44IEMyNzIuMzYsNDguOCAyNjguODQsNDQuOCAyNjguODQsNDAgTDI2OC44NCwzOS45MiBDMjY4Ljg0LDM1LjEyIDI3Mi4yOCwzMS4yIDI3Ny4yNCwzMS4yIEMyODIuMiwzMS4yIDI4NS43MiwzNS4yIDI4NS43Miw0MCBMMjg1LjcyLDQwLjA4IEMyODUuNzIsNDQuODggMjgyLjI4LDQ4LjggMjc3LjMyLDQ4LjggWiBNMzAyLjgsNTQgTDMwMi44LDQ1LjA0IEwzMDcuNjQsNDUuMDQgTDMxMy42NCw1NCBMMzIwLjg0LDU0IEwzMTQsNDQgQzMxNy41Niw0Mi42OCAzMjAsMzkuODQgMzIwLDM1LjMyIEwzMjAsMzUuMjQgQzMyMCwzMi42IDMxOS4xNiwzMC40IDMxNy42LDI4Ljg0IEMzMTUuNzYsMjcgMzEzLDI2IDMwOS40NCwyNiBMMjk2LjY0LDI2IEwyOTYuNjQsNTQgTDMwMi44LDU0IFogTTMwOS4wNCwzOS42IEwzMDIuOCwzOS42IEwzMDIuOCwzMS41NiBMMzA4LjkyLDMxLjU2IEMzMTEuOTIsMzEuNTYgMzEzLjc2LDMyLjkyIDMxMy43NiwzNS41NiBMMzEzLjc2LDM1LjY0IEMzMTMuNzYsMzggMzEyLjA0LDM5LjYgMzA5LjA0LDM5LjYgWiBNMzM3LjI0LDU0IEwzMzcuMjQsMzEuNjggTDM0NS43NiwzMS42OCBMMzQ1Ljc2LDI2IEwzMjIuNTYsMjYgTDMyMi41NiwzMS42OCBMMzMxLjA4LDMxLjY4IEwzMzEuMDgsNTQgTDMzNy4yNCw1NCBaIE0xNzEuODQsMTAwLjQ4IEMxNzYuOTYsMTAwLjQ4IDE4MC45Miw5OC40OCAxODMuOCw5Ni4wNCBMMTgzLjgsODMuODggTDE3MS42NCw4My44OCBMMTcxLjY0LDg5LjIgTDE3Ny44NCw4OS4yIEwxNzcuODQsOTMuMiBDMTc2LjI4LDk0LjMyIDE3NC4yOCw5NC44OCAxNzIuMDQsOTQuODggQzE2Ny4wOCw5NC44OCAxNjMuNTYsOTEuMTIgMTYzLjU2LDg2IEwxNjMuNTYsODUuOTIgQzE2My41Niw4MS4xNiAxNjcuMTIsNzcuMiAxNzEuNiw3Ny4yIEMxNzQuODQsNzcuMiAxNzYuNzYsNzguMjQgMTc4LjkyLDgwLjA0IEwxODIuOCw3NS4zNiBDMTc5Ljg4LDcyLjg4IDE3Ni44NCw3MS41MiAxNzEuOCw3MS41MiBDMTYzLjMyLDcxLjUyIDE1Ny4xMiw3OC4wNCAxNTcuMTIsODYgTDE1Ny4xMiw4Ni4wOCBDMTU3LjEyLDk0LjM2IDE2My4xMiwxMDAuNDggMTcxLjg0LDEwMC40OCBaIE0xOTQuODgsMTAwIEwxOTQuODgsOTEuMDQgTDE5OS43Miw5MS4wNCBMMjA1LjcyLDEwMCBMMjEyLjkyLDEwMCBMMjA2LjA4LDkwIEMyMDkuNjQsODguNjggMjEyLjA4LDg1Ljg0IDIxMi4wOCw4MS4zMiBMMjEyLjA4LDgxLjI0IEMyMTIuMDgsNzguNiAyMTEuMjQsNzYuNCAyMDkuNjgsNzQuODQgQzIwNy44NCw3MyAyMDUuMDgsNzIgMjAxLjUyLDcyIEwxODguNzIsNzIgTDE4OC43MiwxMDAgTDE5NC44OCwxMDAgWiBNMjAxLjEyLDg1LjYgTDE5NC44OCw4NS42IEwxOTQuODgsNzcuNTYgTDIwMSw3Ny41NiBDMjA0LDc3LjU2IDIwNS44NCw3OC45MiAyMDUuODQsODEuNTYgTDIwNS44NCw4MS42NCBDMjA1Ljg0LDg0IDIwNC4xMiw4NS42IDIwMS4xMiw4NS42IFogTTIzMC4yNCwxMDAuNDggQzIzOC44OCwxMDAuNDggMjQ1LjE2LDkzLjk2IDI0NS4xNiw4NiBMMjQ1LjE2LDg1LjkyIEMyNDUuMTYsNzcuOTYgMjM4Ljk2LDcxLjUyIDIzMC4zMiw3MS41MiBDMjIxLjY4LDcxLjUyIDIxNS40LDc4LjA0IDIxNS40LDg2IEwyMTUuNCw4Ni4wOCBDMjE1LjQsOTQuMDQgMjIxLjYsMTAwLjQ4IDIzMC4yNCwxMDAuNDggWiBNMjMwLjMyLDk0LjggQzIyNS4zNiw5NC44IDIyMS44NCw5MC44IDIyMS44NCw4NiBMMjIxLjg0LDg1LjkyIEMyMjEuODQsODEuMTIgMjI1LjI4LDc3LjIgMjMwLjI0LDc3LjIgQzIzNS4yLDc3LjIgMjM4LjcyLDgxLjIgMjM4LjcyLDg2IEwyMzguNzIsODYuMDggQzIzOC43Miw5MC44OCAyMzUuMjgsOTQuOCAyMzAuMzIsOTQuOCBaIE0yNjEuMzIsMTAwLjQ0IEMyNjguODQsMTAwLjQ0IDI3My42LDk2LjI4IDI3My42LDg3LjggTDI3My42LDcyIEwyNjcuNDQsNzIgTDI2Ny40NCw4OC4wNCBDMjY3LjQ0LDkyLjQ4IDI2NS4xNiw5NC43NiAyNjEuNCw5NC43NiBDMjU3LjY0LDk0Ljc2IDI1NS4zNiw5Mi40IDI1NS4zNiw4Ny44NCBMMjU1LjM2LDcyIEwyNDkuMiw3MiBMMjQ5LjIsODggQzI0OS4yLDk2LjI0IDI1My44LDEwMC40NCAyNjEuMzIsMTAwLjQ0IFogTTI4NS4wNCwxMDAgTDI4NS4wNCw5MS42IEwyODkuNzIsOTEuNiBDMjk2LDkxLjYgMzAxLjA0LDg4LjI0IDMwMS4wNCw4MS43NiBMMzAxLjA0LDgxLjY4IEMzMDEuMDQsNzUuOTYgMjk3LDcyIDI5MC4zMiw3MiBMMjc4Ljg4LDcyIEwyNzguODgsMTAwIEwyODUuMDQsMTAwIFogTTI4OS45Miw4Ni4xMiBMMjg1LjA0LDg2LjEyIEwyODUuMDQsNzcuNTYgTDI4OS44LDc3LjU2IEMyOTIuODgsNzcuNTYgMjk0LjgsNzkuMDQgMjk0LjgsODEuOCBMMjk0LjgsODEuODggQzI5NC44LDg0LjI4IDI5Myw4Ni4xMiAyODkuOTIsODYuMTIgWiIgaWQ9IlNVUFBPUlRHUk9VUCIgc3Ryb2tlPSIjMDkwOTA3IiBmaWxsPSIjMDkwOTA3IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgIDwvZz4KPC9zdmc+" alt="UXSG" style="height: 31px; width: auto; display: block; margin-right: -11px;" />
                                        </td>
                                        <td style="padding: 0; padding-left: 11px; padding-right: 0; width: 1px; vertical-align: middle;">
                                          <table role="presentation" style="width: 1px; height: 34px; border-collapse: collapse;">
                                            <tr><td style="width: 1px; height: 34px; border-left: 1px solid #E0E0E0; line-height: 0; font-size: 0;">&nbsp;</td></tr>
                                          </table>
                                        </td>
                                        <td style="padding: 0; padding-left: 7px; vertical-align: middle;">
                                          <h3 style="margin: 0; font-size: 21px; font-weight: 600; color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1;">
                                            AI<span style="color: #995AF2;">x</span>UX Summit 2025
                                          </h3>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <!-- Separator Line -->
                          <tr>
                            <td style="padding: 0; border-bottom: 1px solid #E0E0E0;"></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 24px; color: #1A1A1A; font-size: 40px; font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Welcome! 👋</h2>
                        <p style="margin: 0 0 20px; color: #4A4A4A; font-size: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
                          You've requested a magic link to access your profile card for the AI<span style="color: #995AF2;">x</span>UX Virtual Summit 2025.
                        </p>
                        <p style="margin: 0 0 30px; color: #4A4A4A; font-size: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6;">
                          Click the button below to ${existingProfile ? "view or edit your profile card" : "create your profile card"}:
                        </p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" style="width: 100%; margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${magicLink}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                ${existingProfile ? "Edit My Profile Card" : "Create My Profile Card"}
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Alternative Link -->
                        <div style="margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #8B5CF6;">
                          <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; font-weight: 600;">Can't click the button?</p>
                          <p style="margin: 0; color: #4b5563; font-size: 14px; word-break: break-all;">
                            Copy and paste this link into your browser:<br>
                            <a href="${magicLink}" style="color: #8B5CF6; text-decoration: underline;">${magicLink}</a>
                          </p>
                        </div>
                        
                        <!-- Important Info -->
                        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                          <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                            <strong style="color: #374151;">⏰ This link expires in 24 hours</strong>
                          </p>
                          <p style="margin: 0; color: #6b7280; font-size: 14px;">
                            For security reasons, this magic link can only be used once and will expire after 24 hours. If you need a new link, simply request another one.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                          <strong style="color: #374151;">Didn't request this?</strong>
                        </p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                          You can safely ignore this email. No changes will be made to your account.
                        </p>
                        <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                          © ${new Date().getFullYear()} UX Support Group. All rights reserved.<br>
                          <a href="${PUBLIC_SITE_URL}" style="color: #8B5CF6; text-decoration: none;">${PUBLIC_SITE_URL}</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      if (emailError) {
        console.error("[SEND-MAGIC-LINK] Resend API error:", emailError);
        throw emailError;
      }

      console.log("[SEND-MAGIC-LINK] Email sent successfully", {
        id: emailData?.id,
        to: email,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Magic link sent! Check your email to log in.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(JSON.stringify({ error: "Failed to send email. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error sending magic link:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
