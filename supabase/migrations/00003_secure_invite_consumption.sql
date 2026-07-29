-- Harden circle membership and provide atomic invite consumption.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP POLICY IF EXISTS "Users can join circles" ON circle_members;

CREATE POLICY "Circle creators can add themselves as owner"
ON circle_members
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND role = 'owner'
  AND status = 'active'
  AND EXISTS (
    SELECT 1
    FROM circles
    WHERE circles.id = circle_members.circle_id
      AND circles.created_by = auth.uid()
  )
);

CREATE OR REPLACE FUNCTION consume_circle_invite(p_token TEXT)
RETURNS TABLE (circle_id UUID, circle_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_invite circle_invites%ROWTYPE;
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'authentication_required';
  END IF;

  SELECT *
  INTO v_invite
  FROM circle_invites
  WHERE token_hash = encode(digest(p_token, 'sha256'), 'hex')
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invite_invalid';
  END IF;

  IF v_invite.revoked_at IS NOT NULL THEN
    RAISE EXCEPTION 'invite_revoked';
  END IF;

  IF v_invite.expires_at <= now() THEN
    RAISE EXCEPTION 'invite_expired';
  END IF;

  IF v_invite.used_count >= v_invite.max_uses THEN
    RAISE EXCEPTION 'invite_exhausted';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM circle_members cm
    WHERE cm.circle_id = v_invite.circle_id
      AND cm.user_id = v_user_id
      AND cm.status = 'active'
  ) THEN
    RETURN QUERY
    SELECT c.id, c.name
    FROM circles c
    WHERE c.id = v_invite.circle_id;
    RETURN;
  END IF;

  INSERT INTO circle_members (circle_id, user_id, role, status)
  VALUES (v_invite.circle_id, v_user_id, 'member', 'active')
  ON CONFLICT (circle_id, user_id)
  DO UPDATE SET status = 'active', role = 'member', joined_at = now();

  UPDATE circle_invites
  SET used_count = used_count + 1
  WHERE id = v_invite.id;

  RETURN QUERY
  SELECT c.id, c.name
  FROM circles c
  WHERE c.id = v_invite.circle_id;
END;
$$;

REVOKE ALL ON FUNCTION consume_circle_invite(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION consume_circle_invite(TEXT) TO authenticated;
