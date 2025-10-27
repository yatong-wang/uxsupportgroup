-- Create sponsorship_inquiries table
CREATE TABLE public.sponsorship_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  package_interest TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sponsorship_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert inquiries
CREATE POLICY "Anyone can submit inquiries"
ON public.sponsorship_inquiries
FOR INSERT
WITH CHECK (true);

-- Only admins can view inquiries
CREATE POLICY "Admins can view all inquiries"
ON public.sponsorship_inquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Only admins can update inquiries (for status/notes)
CREATE POLICY "Admins can update inquiries"
ON public.sponsorship_inquiries
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));