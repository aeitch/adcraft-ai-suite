-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view agencies they belong to" ON public.agencies;

-- Create a simpler policy that doesn't cause recursion
-- Agency owners can view their own agencies (already covered by the ALL policy, but adding explicit SELECT)
CREATE POLICY "Users can view their own agencies"
ON public.agencies
FOR SELECT
USING (owner_id = auth.uid());