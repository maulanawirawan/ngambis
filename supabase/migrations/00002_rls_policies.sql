-- Helper functions for RLS
CREATE OR REPLACE FUNCTION is_circle_member(circle_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM circle_members
    WHERE circle_members.circle_id = is_circle_member.circle_id
    AND circle_members.user_id = is_circle_member.user_id
    AND circle_members.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_circle_admin(circle_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM circle_members
    WHERE circle_members.circle_id = is_circle_admin.circle_id
    AND circle_members.user_id = is_circle_admin.user_id
    AND circle_members.role IN ('owner', 'admin')
    AND circle_members.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION can_view_resource(
  p_visibility visibility,
  p_owner_id UUID,
  p_circle_id UUID,
  p_user_id UUID,
  p_resource_type TEXT,
  p_resource_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Owner can always view
  IF p_owner_id = p_user_id THEN
    RETURN TRUE;
  END IF;

  -- Private items: only owner
  IF p_visibility = 'private' THEN
    RETURN FALSE;
  END IF;

  -- Circle visibility: any active member
  IF p_visibility = 'circle' THEN
    RETURN is_circle_member(p_circle_id, p_user_id);
  END IF;

  -- Selected members: check resource_permissions
  IF p_visibility = 'selected_members' THEN
    RETURN EXISTS (
      SELECT 1 FROM resource_permissions
      WHERE resource_permissions.resource_type = p_resource_type
      AND resource_permissions.resource_id = p_resource_id
      AND resource_permissions.user_id = p_user_id
      AND resource_permissions.permission IN ('read', 'write')
    );
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_invitation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Public profiles are viewable by circle members" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM circle_members cm1
    JOIN circle_members cm2 ON cm1.circle_id = cm2.circle_id
    WHERE cm1.user_id = profiles.id AND cm2.user_id = auth.uid()
    AND cm1.status = 'active' AND cm2.status = 'active'
  )
);

-- Circles policies
CREATE POLICY "Circle members can view circle" ON circles FOR SELECT USING (
  is_circle_member(id, auth.uid())
);
CREATE POLICY "Circle creators can insert" ON circles FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Circle admins can update" ON circles FOR UPDATE USING (
  is_circle_admin(id, auth.uid())
);
CREATE POLICY "Circle owners can delete" ON circles FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM circle_members
    WHERE circle_id = id AND user_id = auth.uid() AND role = 'owner'
  )
);

-- Circle members policies
CREATE POLICY "Members can view circle members" ON circle_members FOR SELECT USING (
  is_circle_member(circle_id, auth.uid())
);
CREATE POLICY "Circle admins can manage members" ON circle_members FOR ALL USING (
  is_circle_admin(circle_id, auth.uid())
);
CREATE POLICY "Users can join circles" ON circle_members FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Users can leave circles" ON circle_members FOR UPDATE USING (
  auth.uid() = user_id
) WITH CHECK (status = 'left');

-- Circle invites policies
CREATE POLICY "Circle admins can manage invites" ON circle_invites FOR ALL USING (
  is_circle_admin(circle_id, auth.uid())
);
CREATE POLICY "Circle members can view invites" ON circle_invites FOR SELECT USING (
  is_circle_member(circle_id, auth.uid())
);

-- Circle invitation requests policies
CREATE POLICY "Users can view own invitations" ON circle_invitation_requests FOR SELECT USING (
  auth.uid() = invited_user_id OR is_circle_admin(circle_id, auth.uid())
);
CREATE POLICY "Circle admins can create invitations" ON circle_invitation_requests FOR INSERT WITH CHECK (
  is_circle_admin(circle_id, auth.uid())
);
CREATE POLICY "Invited users can respond" ON circle_invitation_requests FOR UPDATE USING (
  auth.uid() = invited_user_id
) WITH CHECK (status IN ('accepted', 'declined'));

-- Study reports policies
CREATE POLICY "Users can view accessible reports" ON study_reports FOR SELECT USING (
  can_view_resource(visibility, owner_id, circle_id, auth.uid(), 'study_reports', id)
);
CREATE POLICY "Users can create reports" ON study_reports FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND is_circle_member(circle_id, auth.uid())
);
CREATE POLICY "Owners can update own reports" ON study_reports FOR UPDATE USING (
  auth.uid() = owner_id
);
CREATE POLICY "Owners can delete own reports" ON study_reports FOR DELETE USING (
  auth.uid() = owner_id
);

-- Report reactions policies
CREATE POLICY "Users can view reactions on accessible reports" ON report_reactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM study_reports
    WHERE study_reports.id = report_reactions.report_id
    AND can_view_resource(study_reports.visibility, study_reports.owner_id, study_reports.circle_id, auth.uid(), 'study_reports', study_reports.id)
  )
);
CREATE POLICY "Users can add reactions" ON report_reactions FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Users can remove own reactions" ON report_reactions FOR DELETE USING (
  auth.uid() = user_id
);

-- Report comments policies
CREATE POLICY "Users can view comments on accessible reports" ON report_comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM study_reports
    WHERE study_reports.id = report_comments.report_id
    AND can_view_resource(study_reports.visibility, study_reports.owner_id, study_reports.circle_id, auth.uid(), 'study_reports', study_reports.id)
  )
);
CREATE POLICY "Users can add comments" ON report_comments FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Users can update own comments" ON report_comments FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Users can delete own comments" ON report_comments FOR DELETE USING (
  auth.uid() = user_id
);

-- Planning boards policies
CREATE POLICY "Users can view accessible boards" ON planning_boards FOR SELECT USING (
  can_view_resource(visibility, owner_id, circle_id, auth.uid(), 'planning_boards', id)
);
CREATE POLICY "Users can create boards" ON planning_boards FOR INSERT WITH CHECK (
  is_circle_member(circle_id, auth.uid())
);
CREATE POLICY "Board owners can update" ON planning_boards FOR UPDATE USING (
  auth.uid() = owner_id OR is_circle_admin(circle_id, auth.uid())
);
CREATE POLICY "Board owners can delete" ON planning_boards FOR DELETE USING (
  auth.uid() = owner_id OR is_circle_admin(circle_id, auth.uid())
);

-- Board stages policies
CREATE POLICY "Users can view stages of accessible boards" ON board_stages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM planning_boards
    WHERE planning_boards.id = board_stages.board_id
    AND can_view_resource(planning_boards.visibility, planning_boards.owner_id, planning_boards.circle_id, auth.uid(), 'planning_boards', planning_boards.id)
  )
);
CREATE POLICY "Board members can manage stages" ON board_stages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM planning_boards
    WHERE planning_boards.id = board_stages.board_id
    AND (auth.uid() = planning_boards.owner_id OR is_circle_admin(planning_boards.circle_id, auth.uid()))
  )
);

-- Planning cards policies
CREATE POLICY "Users can view accessible cards" ON planning_cards FOR SELECT USING (
  can_view_resource(visibility, owner_id, (SELECT circle_id FROM planning_boards WHERE id = board_id), auth.uid(), 'planning_cards', id)
);
CREATE POLICY "Users can create cards" ON planning_cards FOR INSERT WITH CHECK (
  auth.uid() = owner_id
);
CREATE POLICY "Card owners can update" ON planning_cards FOR UPDATE USING (
  auth.uid() = owner_id
);
CREATE POLICY "Card owners can delete" ON planning_cards FOR DELETE USING (
  auth.uid() = owner_id
);

-- Card assignees policies
CREATE POLICY "Users can view assignees of accessible cards" ON card_assignees FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM planning_cards
    WHERE planning_cards.id = card_assignees.card_id
    AND can_view_resource(planning_cards.visibility, planning_cards.owner_id, (SELECT circle_id FROM planning_boards WHERE id = planning_cards.board_id), auth.uid(), 'planning_cards', planning_cards.id)
  )
);
CREATE POLICY "Card owners can manage assignees" ON card_assignees FOR ALL USING (
  EXISTS (
    SELECT 1 FROM planning_cards
    WHERE planning_cards.id = card_assignees.card_id
    AND planning_cards.owner_id = auth.uid()
  )
);

-- Card checklists policies
CREATE POLICY "Users can view checklists of accessible cards" ON card_checklists FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM planning_cards
    WHERE planning_cards.id = card_checklists.card_id
    AND can_view_resource(planning_cards.visibility, planning_cards.owner_id, (SELECT circle_id FROM planning_boards WHERE id = planning_cards.board_id), auth.uid(), 'planning_cards', planning_cards.id)
  )
);
CREATE POLICY "Card owners can manage checklists" ON card_checklists FOR ALL USING (
  EXISTS (
    SELECT 1 FROM planning_cards
    WHERE planning_cards.id = card_checklists.card_id
    AND planning_cards.owner_id = auth.uid()
  )
);

-- Schedule items policies
CREATE POLICY "Users can view accessible schedule items" ON schedule_items FOR SELECT USING (
  can_view_resource(visibility, owner_id, circle_id, auth.uid(), 'schedule_items', id)
);
CREATE POLICY "Users can create schedule items" ON schedule_items FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND is_circle_member(circle_id, auth.uid())
);
CREATE POLICY "Owners can update own schedule items" ON schedule_items FOR UPDATE USING (
  auth.uid() = owner_id
);
CREATE POLICY "Owners can delete own schedule items" ON schedule_items FOR DELETE USING (
  auth.uid() = owner_id
);

-- Focus sessions policies
CREATE POLICY "Users can view own focus sessions" ON focus_sessions FOR SELECT USING (
  auth.uid() = owner_id
);
CREATE POLICY "Circle members can view shared focus sessions" ON focus_sessions FOR SELECT USING (
  visibility = 'circle' AND is_circle_member(circle_id, auth.uid())
);
CREATE POLICY "Users can create focus sessions" ON focus_sessions FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND is_circle_member(circle_id, auth.uid())
);
CREATE POLICY "Owners can update own focus sessions" ON focus_sessions FOR UPDATE USING (
  auth.uid() = owner_id
);

-- Commitments policies
CREATE POLICY "Users can view accessible commitments" ON commitments FOR SELECT USING (
  can_view_resource(visibility, owner_id, circle_id, auth.uid(), 'commitments', id)
);
CREATE POLICY "Users can create commitments" ON commitments FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND is_circle_member(circle_id, auth.uid())
);
CREATE POLICY "Owners can update own commitments" ON commitments FOR UPDATE USING (
  auth.uid() = owner_id
);
CREATE POLICY "Owners can delete own commitments" ON commitments FOR DELETE USING (
  auth.uid() = owner_id
);

-- Commitment links policies
CREATE POLICY "Users can view links of accessible commitments" ON commitment_links FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM commitments
    WHERE commitments.id = commitment_links.commitment_id
    AND can_view_resource(commitments.visibility, commitments.owner_id, commitments.circle_id, auth.uid(), 'commitments', commitments.id)
  )
);
CREATE POLICY "Commitment owners can manage links" ON commitment_links FOR ALL USING (
  EXISTS (
    SELECT 1 FROM commitments
    WHERE commitments.id = commitment_links.commitment_id
    AND commitments.owner_id = auth.uid()
  )
);

-- Check-ins policies
CREATE POLICY "Users can view accessible check-ins" ON check_ins FOR SELECT USING (
  can_view_resource(visibility, owner_id, circle_id, auth.uid(), 'check_ins', id)
);
CREATE POLICY "Users can create check-ins" ON check_ins FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND is_circle_member(circle_id, auth.uid())
);
CREATE POLICY "Owners can update own check-ins" ON check_ins FOR UPDATE USING (
  auth.uid() = owner_id
);

-- Nudges policies
CREATE POLICY "Users can view own nudges" ON nudges FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Circle members can send nudges" ON nudges FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND is_circle_member(circle_id, auth.uid()) AND is_circle_member(circle_id, recipient_id)
);
CREATE POLICY "Recipients can dismiss nudges" ON nudges FOR UPDATE USING (
  auth.uid() = recipient_id
) WITH CHECK (dismissed_at IS NOT NULL);

-- Resource permissions policies
CREATE POLICY "Users can view own permissions" ON resource_permissions FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = granted_by
);
CREATE POLICY "Resource owners can grant permissions" ON resource_permissions FOR INSERT WITH CHECK (
  auth.uid() = granted_by
);
CREATE POLICY "Resource owners can revoke permissions" ON resource_permissions FOR DELETE USING (
  auth.uid() = granted_by
);

-- Activity logs policies
CREATE POLICY "Circle members can view activity logs" ON activity_logs FOR SELECT USING (
  is_circle_member(circle_id, auth.uid())
);
CREATE POLICY "Users can create activity logs" ON activity_logs FOR INSERT WITH CHECK (
  auth.uid() = actor_id AND is_circle_member(circle_id, auth.uid())
);
