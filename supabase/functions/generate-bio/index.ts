import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { linkedinUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a professional bio writer. Create concise, engaging bios for UX professionals.'
          },
          {
            role: 'user',
            content: `Based on this LinkedIn profile: ${linkedinUrl}, create a professional tweet-length bio (max 280 characters) for a UX professional attending the UXSG AI x UX Virtual Summit. Write in first person, highlight expertise and passion for UX. If you cannot access the LinkedIn profile, create a generic professional bio for a UX professional.`
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const bio = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ bio: bio.substring(0, 280) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating bio:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        bio: 'UX professional passionate about human-centered design and innovation.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
