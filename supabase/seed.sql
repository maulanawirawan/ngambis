-- Seed data for ngambis demo
-- Note: This requires existing auth users. Create users via Supabase Auth first.

-- Demo users (create these via Supabase Auth dashboard or signup flow)
-- User 1: demo1@example.com / password123
-- User 2: demo2@example.com / password123

-- Insert demo profiles (after users are created via auth)
-- These will be created automatically by the handle_new_user trigger

-- Demo circle
INSERT INTO circles (id, name, slug, accent, created_by, default_planning_visibility, default_schedule_visibility)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Demo Circle',
  'demo-circle',
  'coral',
  (SELECT id FROM profiles WHERE username = 'demo1' LIMIT 1),
  'private',
  'private'
) ON CONFLICT (id) DO NOTHING;

-- Add members to circle
INSERT INTO circle_members (circle_id, user_id, role, status)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  id,
  CASE WHEN username = 'demo1' THEN 'owner'::role ELSE 'member'::role END,
  'active'::member_status
FROM profiles
WHERE username IN ('demo1', 'demo2')
ON CONFLICT (circle_id, user_id) DO NOTHING;

-- Demo board
INSERT INTO planning_boards (id, circle_id, owner_id, name, visibility)
VALUES (
  '660e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440000',
  (SELECT id FROM profiles WHERE username = 'demo1' LIMIT 1),
  'Project Board',
  'circle'
) ON CONFLICT (id) DO NOTHING;

-- Demo stages
INSERT INTO board_stages (id, board_id, name, position)
VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 'Kepikiran', 0),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000', 'Siap Digarap', 1),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440000', 'Lagi Jalan', 2),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440000', 'Tinggal Poles', 3),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440000', 'Beres', 4)
ON CONFLICT (id) DO NOTHING;

-- Demo cards
INSERT INTO planning_cards (id, board_id, stage_id, owner_id, title, description, position, visibility)
VALUES
  (
    '880e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440000',
    '770e8400-e29b-41d4-a716-446655440001',
    (SELECT id FROM profiles WHERE username = 'demo1' LIMIT 1),
    'Belajar Next.js',
    'Pelajari App Router dan Server Components',
    0,
    'circle'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440000',
    '770e8400-e29b-41d4-a716-446655440002',
    (SELECT id FROM profiles WHERE username = 'demo1' LIMIT 1),
    'Setup Supabase',
    'Konfigurasi database dan auth',
    0,
    'private'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440000',
    '770e8400-e29b-41d4-a716-446655440003',
    (SELECT id FROM profiles WHERE username = 'demo2' LIMIT 1),
    'Design System',
    'Buat komponen UI yang konsisten',
    0,
    'circle'
  )
ON CONFLICT (id) DO NOTHING;

-- Demo schedule items
INSERT INTO schedule_items (id, circle_id, owner_id, title, schedule_date, daypart, visibility)
VALUES
  (
    '990e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    (SELECT id FROM profiles WHERE username = 'demo1' LIMIT 1),
    'Morning Study',
    CURRENT_DATE,
    'pagi',
    'private'
  ),
  (
    '990e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    (SELECT id FROM profiles WHERE username = 'demo1' LIMIT 1),
    'Team Sync',
    CURRENT_DATE,
    'siang',
    'circle'
  )
ON CONFLICT (id) DO NOTHING;

-- Demo reports
INSERT INTO study_reports (id, circle_id, owner_id, report_date, topic, progress, visibility)
VALUES
  (
    'aa0e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    (SELECT id FROM profiles WHERE username = 'demo1' LIMIT 1),
    CURRENT_DATE,
    'Setup Project',
    'Berhasil setup Next.js dengan TypeScript dan Tailwind',
    'circle'
  ),
  (
    'aa0e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    (SELECT id FROM profiles WHERE username = 'demo2' LIMIT 1),
    CURRENT_DATE,
    'Design Research',
    'Mencari inspirasi untuk UI yang playful tapi profesional',
    'circle'
  )
ON CONFLICT (id) DO NOTHING;

-- Demo check-ins
INSERT INTO check_ins (id, circle_id, owner_id, check_in_date, state, visibility)
VALUES
  (
    'bb0e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    (SELECT id FROM profiles WHERE username = 'demo1' LIMIT 1),
    CURRENT_DATE,
    'siap_gas',
    'circle'
  ),
  (
    'bb0e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    (SELECT id FROM profiles WHERE username = 'demo2' LIMIT 1),
    CURRENT_DATE,
    'santai_dulu',
    'circle'
  )
ON CONFLICT (id) DO NOTHING;
