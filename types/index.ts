export type Visibility = "private" | "circle" | "selected_members";
export type Accent = "coral" | "moss" | "cobalt" | "butter" | "plum";
export type Role = "owner" | "admin" | "member";
export type MemberStatus = "active" | "invited" | "left";
export type InviteStatus = "pending" | "accepted" | "declined" | "expired";
export type Daypart = "pagi" | "siang" | "sore" | "malam";
export type FocusOutcome = "selesai" | "lanjut_nanti" | "blocker";
export type CheckInState = "siap_gas" | "santai_dulu" | "agak_penuh" | "sedang_off";
export type PaperVariant = "default" | "lined" | "grid" | "dot";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_path: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Circle {
  id: string;
  name: string;
  slug: string;
  accent: Accent;
  created_by: string;
  default_planning_visibility: Visibility;
  default_schedule_visibility: Visibility;
  created_at: string;
  updated_at: string;
}

export interface CircleMember {
  circle_id: string;
  user_id: string;
  role: Role;
  status: MemberStatus;
  joined_at: string;
  profile?: Profile;
}

export interface CircleInvite {
  id: string;
  circle_id: string;
  token_hash: string;
  created_by: string;
  expires_at: string;
  max_uses: number;
  used_count: number;
  revoked_at: string | null;
  created_at: string;
}

export interface CircleInvitationRequest {
  id: string;
  circle_id: string;
  invited_user_id: string;
  invited_by: string;
  status: InviteStatus;
  created_at: string;
  responded_at: string | null;
}

export interface StudyReport {
  id: string;
  circle_id: string;
  owner_id: string;
  report_date: string;
  topic: string;
  progress: string;
  learning: string | null;
  blocker: string | null;
  next_step: string | null;
  duration_minutes: number | null;
  mood: string | null;
  visibility: Visibility;
  is_locked: boolean;
  locked_at: string | null;
  locked_by: string | null;
  created_at: string;
  updated_at: string;
  owner?: Profile;
  reactions?: ReportReaction[];
  comments?: ReportComment[];
}

export interface ReportReaction {
  id: string;
  report_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: Profile;
}

export interface ReportComment {
  id: string;
  report_id: string;
  user_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface PlanningBoard {
  id: string;
  circle_id: string;
  owner_id: string | null;
  name: string;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
  stages?: BoardStage[];
}

export interface BoardStage {
  id: string;
  board_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
  cards?: PlanningCard[];
}

export interface PlanningCard {
  id: string;
  board_id: string;
  stage_id: string;
  owner_id: string;
  title: string;
  description: string | null;
  position: number;
  label: string | null;
  paper_variant: PaperVariant;
  due_at: string | null;
  estimated_minutes: number | null;
  completed_at: string | null;
  visibility: Visibility;
  is_locked: boolean;
  locked_at: string | null;
  locked_by: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  owner?: Profile;
  assignees?: CardAssignee[];
  checklists?: CardChecklist[];
}

export interface CardAssignee {
  card_id: string;
  user_id: string;
  assigned_by: string;
  created_at: string;
  user?: Profile;
}

export interface CardChecklist {
  id: string;
  card_id: string;
  body: string;
  is_done: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleItem {
  id: string;
  circle_id: string;
  owner_id: string;
  planning_card_id: string | null;
  title: string;
  description: string | null;
  schedule_date: string;
  start_time: string | null;
  end_time: string | null;
  daypart: Daypart;
  recurrence_rule: string | null;
  completed_at: string | null;
  visibility: Visibility;
  is_locked: boolean;
  locked_at: string | null;
  locked_by: string | null;
  created_at: string;
  updated_at: string;
  owner?: Profile;
  planning_card?: PlanningCard;
}

export interface FocusSession {
  id: string;
  circle_id: string;
  owner_id: string;
  planning_card_id: string | null;
  schedule_item_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  outcome: FocusOutcome | null;
  visibility: Visibility;
  created_at: string;
  owner?: Profile;
}

export interface Commitment {
  id: string;
  circle_id: string;
  owner_id: string;
  title: string;
  description: string | null;
  starts_on: string;
  due_on: string;
  completed_at: string | null;
  visibility: Visibility;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  owner?: Profile;
  linked_cards?: PlanningCard[];
  progress?: number;
}

export interface CommitmentLink {
  commitment_id: string;
  planning_card_id: string;
}

export interface CheckIn {
  id: string;
  circle_id: string;
  owner_id: string;
  check_in_date: string;
  state: CheckInState;
  note: string | null;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
  owner?: Profile;
}

export interface Nudge {
  id: string;
  circle_id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
  dismissed_at: string | null;
  sender?: Profile;
}

export interface ResourcePermission {
  id: string;
  resource_type: string;
  resource_id: string;
  user_id: string;
  permission: "read" | "write";
  granted_by: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  circle_id: string;
  actor_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at" | "updated_at">; Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">> };
      circles: { Row: Circle; Insert: Omit<Circle, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Circle, "id" | "created_at" | "updated_at">> };
      circle_members: { Row: CircleMember; Insert: Omit<CircleMember, "joined_at">; Update: Partial<Omit<CircleMember, "circle_id" | "user_id" | "joined_at">> };
      circle_invites: { Row: CircleInvite; Insert: Omit<CircleInvite, "id" | "created_at">; Update: Partial<Omit<CircleInvite, "id" | "created_at">> };
      circle_invitation_requests: { Row: CircleInvitationRequest; Insert: Omit<CircleInvitationRequest, "id" | "created_at">; Update: Partial<Omit<CircleInvitationRequest, "id" | "created_at">> };
      study_reports: { Row: StudyReport; Insert: Omit<StudyReport, "id" | "created_at" | "updated_at">; Update: Partial<Omit<StudyReport, "id" | "created_at" | "updated_at">> };
      report_reactions: { Row: ReportReaction; Insert: Omit<ReportReaction, "id" | "created_at">; Update: Partial<Omit<ReportReaction, "id" | "created_at">> };
      report_comments: { Row: ReportComment; Insert: Omit<ReportComment, "id" | "created_at" | "updated_at">; Update: Partial<Omit<ReportComment, "id" | "created_at" | "updated_at">> };
      planning_boards: { Row: PlanningBoard; Insert: Omit<PlanningBoard, "id" | "created_at" | "updated_at">; Update: Partial<Omit<PlanningBoard, "id" | "created_at" | "updated_at">> };
      board_stages: { Row: BoardStage; Insert: Omit<BoardStage, "id" | "created_at" | "updated_at">; Update: Partial<Omit<BoardStage, "id" | "created_at" | "updated_at">> };
      planning_cards: { Row: PlanningCard; Insert: Omit<PlanningCard, "id" | "created_at" | "updated_at">; Update: Partial<Omit<PlanningCard, "id" | "created_at" | "updated_at">> };
      card_assignees: { Row: CardAssignee; Insert: Omit<CardAssignee, "created_at">; Update: Partial<Omit<CardAssignee, "card_id" | "user_id" | "created_at">> };
      card_checklists: { Row: CardChecklist; Insert: Omit<CardChecklist, "id" | "created_at" | "updated_at">; Update: Partial<Omit<CardChecklist, "id" | "created_at" | "updated_at">> };
      schedule_items: { Row: ScheduleItem; Insert: Omit<ScheduleItem, "id" | "created_at" | "updated_at">; Update: Partial<Omit<ScheduleItem, "id" | "created_at" | "updated_at">> };
      focus_sessions: { Row: FocusSession; Insert: Omit<FocusSession, "id" | "created_at">; Update: Partial<Omit<FocusSession, "id" | "created_at">> };
      commitments: { Row: Commitment; Insert: Omit<Commitment, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Commitment, "id" | "created_at" | "updated_at">> };
      commitment_links: { Row: CommitmentLink; Insert: CommitmentLink; Update: CommitmentLink };
      check_ins: { Row: CheckIn; Insert: Omit<CheckIn, "id" | "created_at" | "updated_at">; Update: Partial<Omit<CheckIn, "id" | "created_at" | "updated_at">> };
      nudges: { Row: Nudge; Insert: Omit<Nudge, "id" | "created_at">; Update: Partial<Omit<Nudge, "id" | "created_at">> };
      resource_permissions: { Row: ResourcePermission; Insert: Omit<ResourcePermission, "id" | "created_at">; Update: Partial<Omit<ResourcePermission, "id" | "created_at">> };
      activity_logs: { Row: ActivityLog; Insert: Omit<ActivityLog, "id" | "created_at">; Update: Partial<Omit<ActivityLog, "id" | "created_at">> };
    };
  };
}
