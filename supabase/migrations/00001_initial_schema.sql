-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE visibility AS ENUM ('private', 'circle', 'selected_members');
CREATE TYPE accent AS ENUM ('coral', 'moss', 'cobalt', 'butter', 'plum');
CREATE TYPE role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE member_status AS ENUM ('active', 'invited', 'left');
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE daypart AS ENUM ('pagi', 'siang', 'sore', 'malam');
CREATE TYPE focus_outcome AS ENUM ('selesai', 'lanjut_nanti', 'blocker');
CREATE TYPE check_in_state AS ENUM ('siap_gas', 'santai_dulu', 'agak_penuh', 'sedang_off');
CREATE TYPE paper_variant AS ENUM ('default', 'lined', 'grid', 'dot');
CREATE TYPE permission_level AS ENUM ('read', 'write');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_path TEXT,
  timezone TEXT DEFAULT 'Asia/Jakarta',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Circles table
CREATE TABLE circles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  accent accent DEFAULT 'coral',
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  default_planning_visibility visibility DEFAULT 'private',
  default_schedule_visibility visibility DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Circle members table
CREATE TABLE circle_members (
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role role DEFAULT 'member',
  status member_status DEFAULT 'active',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (circle_id, user_id)
);

-- Circle invites table
CREATE TABLE circle_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  max_uses INT DEFAULT 10,
  used_count INT DEFAULT 0,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Circle invitation requests table
CREATE TABLE circle_invitation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status invite_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ
);

-- Study reports table
CREATE TABLE study_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  topic TEXT NOT NULL,
  progress TEXT NOT NULL,
  learning TEXT,
  blocker TEXT,
  next_step TEXT,
  duration_minutes INT,
  mood TEXT,
  visibility visibility DEFAULT 'circle',
  is_locked BOOLEAN DEFAULT false,
  locked_at TIMESTAMPTZ,
  locked_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Report reactions table
CREATE TABLE report_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES study_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (report_id, user_id, emoji)
);

-- Report comments table
CREATE TABLE report_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES study_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Planning boards table
CREATE TABLE planning_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  visibility visibility DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Board stages table
CREATE TABLE board_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES planning_boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Planning cards table
CREATE TABLE planning_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES planning_boards(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES board_stages(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INT NOT NULL,
  label TEXT,
  paper_variant paper_variant DEFAULT 'default',
  due_at TIMESTAMPTZ,
  estimated_minutes INT,
  completed_at TIMESTAMPTZ,
  visibility visibility DEFAULT 'private',
  is_locked BOOLEAN DEFAULT false,
  locked_at TIMESTAMPTZ,
  locked_by UUID REFERENCES profiles(id),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Card assignees table
CREATE TABLE card_assignees (
  card_id UUID NOT NULL REFERENCES planning_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (card_id, user_id)
);

-- Card checklists table
CREATE TABLE card_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES planning_cards(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_done BOOLEAN DEFAULT false,
  position INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Schedule items table
CREATE TABLE schedule_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  planning_card_id UUID REFERENCES planning_cards(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  schedule_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  daypart daypart NOT NULL,
  recurrence_rule TEXT,
  completed_at TIMESTAMPTZ,
  visibility visibility DEFAULT 'private',
  is_locked BOOLEAN DEFAULT false,
  locked_at TIMESTAMPTZ,
  locked_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Focus sessions table
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  planning_card_id UUID REFERENCES planning_cards(id) ON DELETE SET NULL,
  schedule_item_id UUID REFERENCES schedule_items(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_seconds INT NOT NULL,
  outcome focus_outcome,
  visibility visibility DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Commitments table
CREATE TABLE commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starts_on DATE NOT NULL,
  due_on DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  visibility visibility DEFAULT 'private',
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Commitment links table
CREATE TABLE commitment_links (
  commitment_id UUID NOT NULL REFERENCES commitments(id) ON DELETE CASCADE,
  planning_card_id UUID NOT NULL REFERENCES planning_cards(id) ON DELETE CASCADE,
  PRIMARY KEY (commitment_id, planning_card_id)
);

-- Check-ins table
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  state check_in_state NOT NULL,
  note TEXT,
  visibility visibility DEFAULT 'circle',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (circle_id, owner_id, check_in_date)
);

-- Nudges table
CREATE TABLE nudges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  dismissed_at TIMESTAMPTZ
);

-- Resource permissions table
CREATE TABLE resource_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission permission_level NOT NULL,
  granted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (resource_type, resource_id, user_id)
);

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_circle_members_user ON circle_members(user_id);
CREATE INDEX idx_circle_members_circle ON circle_members(circle_id);
CREATE INDEX idx_study_reports_circle_date ON study_reports(circle_id, report_date DESC);
CREATE INDEX idx_study_reports_owner ON study_reports(owner_id);
CREATE INDEX idx_planning_cards_stage ON planning_cards(stage_id, position);
CREATE INDEX idx_planning_cards_owner ON planning_cards(owner_id);
CREATE INDEX idx_schedule_items_circle_date ON schedule_items(circle_id, schedule_date);
CREATE INDEX idx_schedule_items_owner ON schedule_items(owner_id);
CREATE INDEX idx_focus_sessions_owner ON focus_sessions(owner_id);
CREATE INDEX idx_focus_sessions_circle ON focus_sessions(circle_id);
CREATE INDEX idx_check_ins_circle_date ON check_ins(circle_id, check_in_date DESC);
CREATE INDEX idx_nudges_recipient ON nudges(recipient_id, dismissed_at);
CREATE INDEX idx_resource_permissions ON resource_permissions(resource_type, resource_id, user_id);
CREATE INDEX idx_activity_logs_circle ON activity_logs(circle_id, created_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_circles_updated_at BEFORE UPDATE ON circles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_study_reports_updated_at BEFORE UPDATE ON study_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_report_comments_updated_at BEFORE UPDATE ON report_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_planning_boards_updated_at BEFORE UPDATE ON planning_boards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_board_stages_updated_at BEFORE UPDATE ON board_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_planning_cards_updated_at BEFORE UPDATE ON planning_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_card_checklists_updated_at BEFORE UPDATE ON card_checklists FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_schedule_items_updated_at BEFORE UPDATE ON schedule_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_commitments_updated_at BEFORE UPDATE ON commitments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_check_ins_updated_at BEFORE UPDATE ON check_ins FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
