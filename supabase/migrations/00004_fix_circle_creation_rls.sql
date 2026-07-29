-- Migration: Fix circle creation RLS SELECT policy
-- Allow circle creators to select their created circles

DROP POLICY IF EXISTS "Circle members can view circle" ON circles;

CREATE POLICY "Circle members can view circle" ON circles FOR SELECT USING (
  is_circle_member(id, auth.uid()) OR auth.uid() = created_by
);
