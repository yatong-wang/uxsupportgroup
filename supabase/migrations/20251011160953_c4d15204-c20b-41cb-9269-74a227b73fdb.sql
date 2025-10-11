-- Create email subscriptions table
CREATE TABLE IF NOT EXISTS public.email_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email
CREATE POLICY "Anyone can subscribe"
ON public.email_subscriptions
FOR INSERT
WITH CHECK (true);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON public.email_subscriptions(email);