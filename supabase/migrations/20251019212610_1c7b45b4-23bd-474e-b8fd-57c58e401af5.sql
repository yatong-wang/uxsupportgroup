-- Add DELETE policy for admins on user_profiles
CREATE POLICY "Only admins can delete profiles"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Update enrichments foreign key to cascade deletes
ALTER TABLE public.enrichments 
DROP CONSTRAINT IF EXISTS enrichments_user_id_fkey;

ALTER TABLE public.enrichments
ADD CONSTRAINT enrichments_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.user_profiles(id) 
ON DELETE CASCADE;