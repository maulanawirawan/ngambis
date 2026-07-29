# MASTER BUILD PROMPT — NGAMBIS

Kamu adalah senior full-stack product engineer, frontend architect, UX engineer, database engineer, security reviewer, dan QA engineer. Tugasmu adalah membangun aplikasi web production-grade bernama **ngambis.** secara lengkap dari nol sampai siap dijalankan secara lokal dan siap dideploy ke Vercel.

Jangan berhenti pada mockup, wireframe, pseudo-code, atau potongan komponen. Hasil akhir harus berupa repository source code utuh, dapat di-install, dapat di-build, dapat diuji, dan terdokumentasi.

---

## 0. CARA KERJA WAJIB

1. Kerjakan langsung dengan best judgment. Jangan mengulang pertanyaan yang jawabannya sudah ada di prompt ini.
2. Gunakan versi **latest stable** pada saat eksekusi. Sebelum mengunci dependency, verifikasi dokumentasi resmi masing-masing library.
3. Jangan menggunakan beta, canary, experimental package, atau dependency abandoned kecuali benar-benar diperlukan dan dijelaskan.
4. Prioritaskan:
   - ringan,
   - maintainable,
   - accessible,
   - aman,
   - free-tier-first,
   - tidak bergantung pada laptop sebagai server,
   - tidak terkunci hanya pada Vercel.
5. Jangan memakai layanan berbayar, paid API, payment method, AI API, subscription, atau vendor email eksternal.
6. Jangan memasukkan credential ke repository.
7. Jangan mengklaim fitur selesai sebelum:
   - typecheck lolos,
   - lint lolos,
   - unit test lolos,
   - build production lolos,
   - alur utama diuji.
8. Bila menemukan konflik requirement, prioritaskan:
   1. keamanan dan privasi,
   2. usability,
   3. performa,
   4. estetika.
9. Jangan membuat UI generik seperti dashboard SaaS template, bento-grid generik, gradient ungu-biru, glassmorphism berlebihan, atau tampilan yang terasa AI-generated.
10. Semua keputusan penting harus dicatat di `DECISIONS.md`.

---

# 1. IDENTITAS PRODUK

## Nama
**ngambis.**

## Tagline
**Santai, tapi serius.**

## Product category
Private accountability and planning workspace.

## Tujuan
Membantu dua orang atau lebih untuk:
- melaporkan progres harian,
- membuat perencanaan,
- memindahkan pekerjaan antar-stage,
- menyusun ritme/jadwal,
- menjalankan focus session,
- membuat commitment,
- saling memberi gentle nudge,
- melihat insight sederhana,
- tetap memiliki kontrol privasi per item.

Aplikasi harus nyaman untuk dua pengguna pada awal pemakaian, tetapi arsitektur database dan permission harus mendukung:
- banyak user,
- banyak circle,
- banyak board,
- banyak member,
- role berbeda,
- item private, circle, dan selected members.

---

# 2. BATASAN PRODUK

Jangan implementasikan:
- AI summary,
- chatbot,
- AI recommendation,
- subscription,
- payment gateway,
- public social feed,
- marketplace,
- video call,
- full chat,
- paid analytics,
- paid icon pack,
- paid font,
- email marketing,
- vendor email eksternal,
- tracking invasif,
- iklan.

Jangan memakai laptop pengguna sebagai production database atau server.

---

# 3. REKOMENDASI TECH STACK

Gunakan versi stable terbaru pada saat build, dengan baseline berikut:

## Core
- Next.js App Router
- React
- TypeScript strict mode
- Node.js runtime
- pnpm

## Styling dan UI
- Tailwind CSS
- CSS custom properties untuk design tokens
- Radix UI primitives hanya jika diperlukan
- Lucide hanya untuk utility icon
- Custom SVG untuk brand illustration dan icon utama
- Motion for React untuk animation
- Embla Carousel untuk orbit navigation bila memang paling stabil
- dnd-kit untuk drag-and-drop board

## Data dan backend
- Supabase PostgreSQL
- Supabase Auth
- Supabase Row Level Security
- Supabase Realtime hanya jika memberi nilai nyata
- Next.js Server Actions dan/atau Route Handlers
- Zod untuk validation

## Chart
- Apache ECharts, modular import
- Dynamic import saat panel Insights dibuka
- Jangan memakai ApexCharts sebagai default
- Semua chart harus responsive dan accessible

## Testing
- Vitest
- React Testing Library
- Playwright
- axe atau alternatif accessibility testing yang ringan

## Quality
- ESLint
- Prettier
- Husky/lint-staged hanya bila tidak menambah setup berlebihan
- GitHub Actions untuk lint, typecheck, test, dan build

Jangan menambahkan ORM jika Supabase client dan SQL migrations sudah cukup. Jika memilih ORM, jelaskan alasan dan pastikan tidak menambah kompleksitas yang tidak perlu.

---

# 4. MODEL DEPLOYMENT

Arsitektur production:

Browser / Mobile
→ Next.js on Vercel
→ Supabase Auth + PostgreSQL + RLS

Ketentuan:
- Source code harus bisa dijalankan lokal.
- Deployment target utama Vercel.
- Database target utama Supabase Free.
- Tidak boleh hard-lock pada Vercel-specific database.
- Buat `.env.example`.
- Buat `DEPLOYMENT.md`.
- Buat `SUPABASE_SETUP.md`.
- Buat `AGENT_DEPLOY_PROMPT.md`.
- Jangan meminta secret melalui chat.
- Semua secret hanya dimasukkan pengguna melalui local env atau dashboard provider.

---

# 5. FREE-TIER-FIRST

Semua fitur harus dirancang agar cocok untuk free tier.

Wajib:
- Tidak memakai API AI.
- Tidak memakai layanan email pihak ketiga.
- Tidak memakai storage berlebihan.
- Avatar dikompres di client.
- Tetapkan batas ukuran upload.
- Prefer text dan SVG.
- Lazy-load chart.
- Query data secara paginated atau per-range.
- Jangan mengambil seluruh history sekaligus.
- Gunakan caching secara hati-hati tanpa membocorkan private data.
- Jangan menyimpan data sensitif di localStorage.
- Jangan menyimpan access token secara manual bila Supabase SDK sudah menangani session.
- Dokumentasikan batas free tier sebagai informasi, bukan hardcoded claim permanen.
- Instruksikan pengguna untuk mengecek batas terbaru di dokumentasi resmi saat deployment.

---

# 6. DESAIN VISUAL

## Karakter
Private progress club × playful editorial instrument panel.

Kesan:
- hangat,
- personal,
- modern,
- lucu tetapi tidak kekanak-kanakan,
- editorial,
- tidak ramai,
- tidak terasa template,
- tidak terasa AI slop.

## Palet utama
Gunakan palet terbatas:

- Warm Canvas: `#F5EFE5`
- Deep Ink: `#211D1E`
- Coral Signal: `#F16F5C`
- Soft Clay: `#D7C7B9`
- Paper White: `#FFFDF8`

Proporsi:
- 78% warm canvas
- 16% deep ink
- 6% accent

Circle dapat memilih satu accent:
- coral,
- moss,
- cobalt,
- butter,
- plum.

Hanya satu accent aktif per circle. Jangan campur semua warna.

## Typography
Gunakan font gratis dan self-host melalui `next/font`.

Rekomendasi:
- Bricolage Grotesque untuk heading/display,
- Geist Sans untuk interface,
- Geist Mono untuk tanggal, durasi, dan statistik.

Gunakan variable font jika tersedia.

## Golden-ratio system
Gunakan golden ratio sebagai guidance, bukan aturan kaku:
- main panel 61.8%,
- support panel 38.2%.

Spacing scale:
- 5, 8, 13, 21, 34, 55.

Type scale:
- 13, 16, 21, 34, 55.

Radius:
- 13px input,
- 21px card,
- 34px hero,
- 999px pill, chart bar, dan small controls.

## Larangan desain
Jangan:
- membuat semua card punya border dan shadow,
- memakai terlalu banyak gradient,
- memakai neon,
- memakai glassmorphism sebagai gaya utama,
- memakai ikon robot,
- memakai 3D blobs generik,
- membuat dashboard KPI template,
- membuat sidebar admin generik,
- memakai skeleton berlebihan,
- membuat animasi yang tidak punya fungsi.

---

# 7. APPLICATION SHELL DAN SCROLLING

## Desktop
Dashboard utama harus terasa sebagai aplikasi satu layar:
- `min-height: 100dvh`
- hindari page scroll pada shell utama,
- gunakan internal scroll hanya pada area yang memang membutuhkan,
- gunakan modal, drawer, tabs, carousel, atau pagination daripada menumpuk konten vertikal.

Target:
- dashboard utama selesai dipahami dalam satu viewport,
- tidak ada endless page,
- tidak ada section landing-page panjang.

## Mobile
Jangan memaksakan zero-scroll jika merusak usability.
Target:
- sekitar 1 sampai 1.5 viewport untuk layar utama,
- horizontal cards,
- bottom sheet,
- sticky action,
- scroll hanya pada area yang relevan.

## Custom scrollbar
Desktop:
- track transparan,
- thumb berbentuk capsule,
- ketebalan 6–8px,
- low opacity,
- lebih jelas saat hover/focus.

Board horizontal:
- tampilkan progress rail atau mini-map,
- jangan hanya mengandalkan scrollbar default.

Mobile:
- scrollbar visual boleh tersembunyi,
- tetapi harus ada edge fade, partial card, swipe hint, atau affordance lain.

Respect:
- `prefers-reduced-motion`,
- keyboard navigation,
- touch,
- screen reader.

---

# 8. NAVIGASI KHAS — HALF-ORBIT DOCK

Buat komponen navigasi unik bernama **Half-Orbit Dock**.

Menu utama:
- Today
- Board
- Rhythm
- Archive
- Circle

Aturan:
- menu aktif berada di tengah,
- item sebelah kiri dan kanan terlihat sebagian,
- bentuk keseluruhan memberi ilusi setengah lingkaran,
- bagian bawah orbit boleh terpotong oleh viewport,
- drag, swipe, click, keyboard arrow harus bekerja,
- active item lebih besar dan jelas,
- adjacent item lebih kecil,
- inactive item memiliki opacity lebih rendah,
- transisi halus dan cepat,
- jangan membuat setir mobil literal,
- jangan membuat navigasi yang mengganggu aksesibilitas.

Baseline motion:
- 150–250ms untuk UI transitions,
- spring hanya untuk orbit dan drag,
- tidak boleh membuat pusing,
- reduced-motion fallback wajib.

Gunakan semantic navigation dan fallback list/tab biasa untuk screen reader.

---

# 9. INFORMATION ARCHITECTURE

## Today
Satu layar ringkas yang menampilkan:
- sapaan,
- status report user,
- anggota circle yang sudah check-in,
- next schedule item,
- active planning card,
- current commitment,
- total focus hari ini,
- quick report,
- quick note,
- gentle nudge terbaru.

Jangan membuat 8 KPI cards.

## Board
Paper Trail Board:
- custom stages,
- sticky notes,
- drag antar-stage,
- drag reorder,
- horizontal panning,
- mini-map,
- side drawer detail,
- low vertical scrolling.

## Rhythm
Custom schedule:
- daypart lanes,
- date wheel,
- drag schedule,
- recurring items,
- focus session linkage,
- private/shared visibility.

## Archive
- month selector,
- calendar heatmap,
- report history,
- completed cards,
- completed commitments,
- focus sessions,
- search/filter drawer,
- no endless timeline.

## Circle
- circle profile,
- member list,
- roles,
- invite management,
- privacy defaults,
- shared goals,
- leave/remove/transfer ownership.

---

# 10. FITUR WAJIB

## 10.1 Authentication
Implementasikan:
- sign up,
- sign in,
- sign out,
- reset/recovery bila diperlukan,
- username unik,
- profile setup,
- protected routes,
- session refresh,
- loading/error states.

Prefer:
- email + password atau magic link melalui kemampuan Supabase yang paling sederhana untuk free setup.

Jangan bergantung pada vendor email eksternal.

Karena email delivery bawaan provider bisa memiliki limit, jadikan invite link dan username sebagai mekanisme utama membership.

## 10.2 Circle
User dapat:
- membuat circle,
- masuk ke banyak circle,
- mengganti active circle,
- mengubah nama circle,
- memilih accent,
- mengatur privacy default,
- meninggalkan circle,
- transfer ownership.

Role:
- owner,
- admin,
- member.

## 10.3 Invite
Mekanisme utama:
1. invite link,
2. short invite code,
3. QR code yang dibuat lokal,
4. username untuk existing user,
5. optional manual auth link bila diperlukan.

Invite harus punya:
- hashed token,
- expiry,
- max uses,
- used count,
- revoked state,
- created by,
- circle id.

Jangan simpan raw invite token di database.

Username search:
- exact atau limited prefix,
- jangan expose seluruh daftar user,
- rate-limit pencarian,
- jangan expose email.

## 10.4 Daily report
Fields:
- topic,
- progress,
- learning,
- blocker,
- next step,
- duration,
- mood,
- report date,
- visibility,
- selected members bila diperlukan.

Actions:
- create,
- edit,
- delete,
- react,
- comment,
- convert completed planning card menjadi report draft.

## 10.5 Paper Trail Board
Default stages:
- Kepikiran
- Siap Digarap
- Lagi Jalan
- Tinggal Poles
- Beres

User dapat:
- rename stage,
- add stage,
- delete stage dengan safe migration card,
- reorder stage,
- add/edit/delete/archive card,
- drag card antar-stage,
- reorder card,
- assign member,
- checklist,
- due date,
- estimate,
- label,
- visibility,
- lock,
- duplicate,
- convert ke schedule,
- convert ke report.

Batas UX:
- rekomendasikan 3–7 stages,
- jangan mengunci secara hard kecuali ada alasan kuat.

Gunakan optimistic update.
Jika save gagal:
- rollback posisi,
- tampilkan non-intrusive error,
- jangan kehilangan data.

## 10.6 Rhythm Planner
Buat kalender/jadwal yang tidak generik.

Konsep:
- date wheel,
- daypart lanes: pagi, siang, sore, malam,
- exact time optional,
- drag antar-daypart dan hari,
- recurring daily/weekly,
- link ke planning card,
- link ke focus session,
- visibility,
- lock,
- completion state.

Jangan meniru Google Calendar grid secara langsung.

## 10.7 Focus Session
Preset:
- 25,
- 45,
- 60,
- custom.

Fitur:
- start,
- pause,
- resume,
- finish,
- cancel,
- link ke card/schedule,
- outcome: selesai, lanjut nanti, blocker,
- duration tersimpan,
- visibility private by default,
- optional share aggregate duration.

Jangan bergantung pada background timer yang tidak reliable.
Gunakan timestamp-based timer agar akurat setelah tab sleep.

## 10.8 Commitments
User dapat:
- membuat weekly commitment,
- set deadline,
- link ke multiple cards,
- private/shared,
- progress otomatis dari linked cards,
- complete/archive.

## 10.9 Check-in
Pilihan ringan:
- siap gas,
- santai dulu,
- agak penuh,
- sedang off.

Dapat private atau circle.
Jangan jadikan mental-health diagnosis.

## 10.10 Gentle Nudge
Predefined atau short custom text:
- gas dikit yuk,
- progress aman?,
- jangan lupa istirahat.

Anti-spam:
- satu active nudge per recipient per reasonable interval,
- rate limit,
- mute,
- dismiss.

Tidak perlu full chat.

## 10.11 Archive dan Insights
Archive:
- reports,
- completed cards,
- commitments,
- focus sessions.

Insights:
- rounded bar,
- soft area line,
- capsule heatmap,
- stage flow,
- planned vs completed.

Rules:
- maksimal satu hero chart per panel,
- dua atau tiga supporting stats,
- filter 7D/30D/90D atau month,
- dynamic import,
- accessible labels,
- no pie chart unless truly justified,
- no misleading axes,
- no animation berlebihan.

Rounded bar wajib punya fully rounded ends bila nilai memungkinkan.

---

# 11. PRIVACY, LOCK, DAN SECURITY

## Visibility model
Semua resource penting harus mendukung:
- `private`
- `circle`
- `selected_members`

Resource:
- report,
- planning card,
- schedule item,
- commitment,
- check-in,
- focus session.

Default:
- planning card: private,
- schedule item: private,
- focus session: private,
- daily report: circle,
- commitment: private,
- check-in: user choice.

User harus secara sadar membagikan item private.

## Lock
Lock bukan sekadar icon frontend.

Fields:
- `visibility`
- `is_locked`
- `locked_at`
- `locked_by`
- `owner_id`

Rules:
- private item hanya dapat dibaca owner,
- circle admin tidak otomatis bisa membaca private content,
- circle owner tidak otomatis bisa membaca private content,
- selected members hanya member yang diberikan permission,
- lock state disimpan di database,
- API tidak boleh mengembalikan resource unauthorized,
- Realtime subscription tidak boleh membocorkan resource unauthorized,
- aggregate insight tidak boleh membocorkan title atau content private.

## Row Level Security
Aktifkan RLS pada seluruh tabel user-facing.

Tulis policy untuk:
- SELECT
- INSERT
- UPDATE
- DELETE

Jangan hanya mengandalkan filter client.

Buat SQL test atau integration test untuk:
- user A tidak bisa membaca private card user B,
- admin circle tidak bisa membaca private schedule member,
- selected member bisa membaca selected resource,
- removed member kehilangan akses,
- revoked invite tidak bisa dipakai,
- user tidak bisa spoof owner_id,
- user tidak bisa memindahkan card ke board yang bukan haknya.

## Service role
- hanya server,
- tidak boleh `NEXT_PUBLIC`,
- tidak boleh masuk browser bundle,
- tidak boleh dicetak di log,
- tidak boleh masuk error response,
- gunakan seminimal mungkin.

## Optional Vault
Jangan implementasikan zero-knowledge Vault sebagai MVP kecuali waktu memungkinkan dan dapat diaudit.

Jika diimplementasikan:
- encrypt di browser,
- AES-GCM,
- key dari passphrase user,
- plaintext dan passphrase tidak dikirim server,
- server menyimpan ciphertext,
- jelaskan tidak ada password recovery,
- vault content tidak masuk search/insight,
- pisahkan jelas dari normal private RLS.

Jangan mengklaim “tidak seorang pun bisa membaca” untuk private RLS biasa, karena operator dengan service role secara teknis punya administrative access.

## Security lain
- CSRF protection sesuai arsitektur Next.js,
- secure headers,
- CSP bila memungkinkan,
- rate limiting untuk invite dan username search,
- sanitize text output,
- no `dangerouslySetInnerHTML` tanpa sanitization,
- validate semua mutation dengan Zod,
- protect redirect URLs,
- prevent open redirects,
- audit dependency,
- prevent IDOR,
- no secrets in client.

---

# 12. DATABASE SCHEMA

Gunakan UUID.

Tabel minimal:

## profiles
- id
- username
- display_name
- avatar_path
- timezone
- created_at
- updated_at

## circles
- id
- name
- slug
- accent
- created_by
- default_planning_visibility
- default_schedule_visibility
- created_at
- updated_at

## circle_members
- circle_id
- user_id
- role
- status
- joined_at

## circle_invites
- id
- circle_id
- token_hash
- created_by
- expires_at
- max_uses
- used_count
- revoked_at
- created_at

## circle_invitation_requests
Untuk invitation via username:
- id
- circle_id
- invited_user_id
- invited_by
- status
- created_at
- responded_at

## study_reports
- id
- circle_id
- owner_id
- report_date
- topic
- progress
- learning
- blocker
- next_step
- duration_minutes
- mood
- visibility
- is_locked
- locked_at
- locked_by
- created_at
- updated_at

## report_reactions
- id
- report_id
- user_id
- emoji
- created_at

Unique reaction rule sesuai UX.

## report_comments
- id
- report_id
- user_id
- body
- created_at
- updated_at

## planning_boards
- id
- circle_id
- owner_id nullable untuk shared board
- name
- visibility
- created_at
- updated_at

## board_stages
- id
- board_id
- name
- position
- created_at
- updated_at

## planning_cards
- id
- board_id
- stage_id
- owner_id
- title
- description
- position
- label
- paper_variant
- due_at
- estimated_minutes
- completed_at
- visibility
- is_locked
- locked_at
- locked_by
- archived_at
- created_at
- updated_at

## card_assignees
- card_id
- user_id
- assigned_by
- created_at

## card_checklists
- id
- card_id
- body
- is_done
- position
- created_at
- updated_at

## schedule_items
- id
- circle_id
- owner_id
- planning_card_id nullable
- title
- description
- schedule_date
- start_time nullable
- end_time nullable
- daypart
- recurrence_rule nullable
- completed_at nullable
- visibility
- is_locked
- locked_at
- locked_by
- created_at
- updated_at

## focus_sessions
- id
- circle_id
- owner_id
- planning_card_id nullable
- schedule_item_id nullable
- started_at
- ended_at
- duration_seconds
- outcome
- visibility
- created_at

## commitments
- id
- circle_id
- owner_id
- title
- description
- starts_on
- due_on
- completed_at
- visibility
- is_locked
- created_at
- updated_at

## commitment_links
- commitment_id
- planning_card_id

## check_ins
- id
- circle_id
- owner_id
- check_in_date
- state
- note nullable
- visibility
- created_at
- updated_at

## nudges
- id
- circle_id
- sender_id
- recipient_id
- body
- created_at
- dismissed_at

## resource_permissions
- id
- resource_type
- resource_id
- user_id
- permission
- granted_by
- created_at

## activity_logs
Catat action penting tanpa menyimpan secret atau private content berlebihan:
- id
- circle_id
- actor_id
- action
- resource_type
- resource_id
- metadata jsonb minimal
- created_at

Tambahkan:
- index,
- foreign key,
- cascade rule yang aman,
- unique constraint,
- check constraint,
- updated_at trigger,
- position strategy yang stabil,
- query view atau function bila benar-benar berguna.

Jangan membuat schema overengineered.

---

# 13. AUTHORIZATION HELPERS

Buat helper/function SQL atau application layer untuk:
- is_circle_member
- is_circle_admin
- can_view_resource
- can_edit_resource
- can_manage_invite

Policy harus mudah dibaca dan diuji.

Hindari recursive RLS policy yang menyebabkan error atau performa buruk.

---

# 14. PERFORMANCE

Target:
- cepat di mobile,
- initial JS kecil,
- chart tidak masuk initial bundle,
- route-level code splitting,
- image optimization,
- SVG inline hanya bila kecil,
- no huge animation package imports,
- no large date library jika native Intl cukup,
- batasi realtime subscription,
- pagination/range query,
- no N+1 query,
- selective columns,
- avoid overfetching.

Gunakan Server Components untuk data yang cocok.
Gunakan Client Components hanya untuk:
- drag-and-drop,
- carousel,
- charts,
- timer,
- interactive forms,
- local optimistic states.

Pastikan:
- no hydration mismatch,
- no layout shift besar,
- no blocking font request,
- no giant background image.

---

# 15. ACCESSIBILITY

Wajib:
- semantic HTML,
- keyboard navigation,
- visible focus,
- sufficient contrast,
- aria label untuk icon-only buttons,
- drag-and-drop keyboard alternative,
- screen-reader status untuk move/save,
- reduced motion,
- chart text summary,
- no color-only status,
- touch target minimal layak,
- modal focus trap,
- escape close,
- correct heading hierarchy.

Half-Orbit Dock harus tetap dapat digunakan tanpa drag.

---

# 16. COPYWRITING

Gunakan Bahasa Indonesia dengan tone:
- santai,
- hangat,
- to the point,
- tidak terlalu alay,
- tidak terlalu corporate.

Contoh:
- CTA: `report aja`
- empty report: `belum ada yang ambis hari ini.`
- save success: `aman. progresmu tercatat.`
- focus finish: `mantap. sesi ini masuk catatan.`
- private: `cuma kamu yang bisa lihat`
- shared: `dibagikan ke circle`
- nudge: `gas dikit yuk`
- error: `belum kesimpan. coba sekali lagi.`

Jangan menggunakan filler AI seperti:
- unlock your potential,
- elevate productivity,
- seamless experience,
- revolutionary,
- supercharge.

---

# 17. CUSTOM SVG DAN BRAND ASSET

Buat custom SVG sederhana dan original:
- book + small star,
- tilted flame streak,
- moon focus,
- report receipt,
- orbit people,
- two pencils,
- small mascot optional.

Rules:
- vector,
- inline React component,
- stroke konsisten,
- tidak mengambil copyrighted mascot,
- tidak perlu image generation eksternal,
- tidak terlalu banyak,
- jangan tampil di setiap card.

Optional mascot:
- nama sementara `Bisi`,
- bentuk kecil seperti biji/titik koma,
- hanya untuk empty, success, dan weekly recap.

---

# 18. RESPONSIVE BEHAVIOR

Desktop:
- one-screen shell,
- 61.8/38.2 panel,
- Half-Orbit bawah,
- drawer kanan,
- board horizontal.

Tablet:
- adaptive two-column,
- orbit lebih compact,
- drawer overlay.

Mobile:
- single-column,
- bottom orbit atau compact carousel,
- bottom sheet forms,
- horizontal summary cards,
- board dapat swipe/pan,
- date wheel compact,
- sticky primary action.

Uji minimal:
- 360×800
- 390×844
- 768×1024
- 1366×768
- 1440×900
- 1920×1080

---

# 19. FILE STRUCTURE

Gunakan struktur jelas seperti:

ngambis/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── invite/
│   └── layout.tsx
├── components/
│   ├── orbit-dock/
│   ├── board/
│   ├── rhythm/
│   ├── reports/
│   ├── charts/
│   ├── circle/
│   ├── privacy/
│   ├── illustrations/
│   └── ui/
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── permissions/
│   ├── validation/
│   ├── analytics/
│   ├── dates/
│   └── utils/
├── hooks/
├── types/
├── supabase/
│   ├── migrations/
│   ├── tests/
│   ├── seed.sql
│   └── config.toml
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── .env.example
├── README.md
├── ARCHITECTURE.md
├── DECISIONS.md
├── SECURITY.md
├── PRIVACY_MODEL.md
├── SUPABASE_SETUP.md
├── DEPLOYMENT.md
├── AGENT_DEPLOY_PROMPT.md
└── package.json

Sesuaikan bila struktur lain lebih baik, tetapi tetap modular.

---

# 20. SEED DAN DEMO MODE

Buat seed data aman:
- 2–4 demo user,
- 1 demo circle,
- beberapa report,
- beberapa board stages,
- beberapa cards,
- schedule,
- focus session,
- commitment.

Jangan memakai email nyata.
Jangan memasukkan credential.

Bila Supabase auth seed rumit, dokumentasikan langkahnya dan sediakan application seed untuk data setelah user dibuat.

Buat optional demo mode lokal agar UI dapat dipreview tanpa production credentials, tetapi jangan biarkan demo bypass bocor ke production.

---

# 21. TESTING WAJIB

## Unit
- validation schema,
- permission helper,
- date/daypart helper,
- focus duration calculation,
- recurrence helper,
- chart aggregation.

## Component
- report form,
- privacy selector,
- orbit keyboard navigation,
- stage card,
- schedule item,
- focus timer.

## Integration
- Supabase queries,
- RLS access,
- invite consume,
- selected-members permission,
- card movement,
- schedule visibility.

## E2E
Minimal:
1. user sign in,
2. create circle,
3. generate invite,
4. second user joins,
5. create private card,
6. verify second user cannot access,
7. share selected card,
8. drag card to another stage,
9. create schedule item,
10. run focus session,
11. submit daily report,
12. view archive,
13. view insights,
14. revoke invite.

## Accessibility
- keyboard-only smoke test,
- modal focus,
- color contrast,
- reduced motion.

## Build gates
Jalankan:
- install,
- lint,
- typecheck,
- unit test,
- integration test jika environment tersedia,
- production build.

Simpan hasil akhir di `BUILD_REPORT.md`.

---

# 22. ERROR, EMPTY, DAN LOADING STATES

Semua halaman harus punya:
- loading,
- empty,
- permission denied,
- offline/network error,
- server error,
- retry,
- optimistic rollback.

Jangan menampilkan raw error Supabase ke user.
Log aman tanpa secret.

---

# 23. DATA EXPORT DAN DELETE

Sediakan:
- export personal data sebagai JSON,
- export reports sebagai CSV,
- delete account flow,
- leave circle,
- transfer ownership sebelum owner keluar,
- delete circle dengan confirmation kuat.

Pastikan cascade behavior aman.
Jangan menghapus data user lain tanpa alasan.

---

# 24. DOCUMENTATION

## README.md
Harus berisi:
- product overview,
- features,
- stack,
- local setup,
- scripts,
- env,
- screenshots placeholder,
- test commands.

## SUPABASE_SETUP.md
- create project,
- retrieve URL/key,
- run migrations,
- configure auth,
- configure redirect URL,
- create storage bucket bila diperlukan,
- test RLS.

## DEPLOYMENT.md
- GitHub setup,
- Vercel import,
- env vars,
- production URL,
- Supabase redirect URL,
- migration order,
- verification checklist,
- rollback notes.

## SECURITY.md
- RLS model,
- service role rules,
- threat assumptions,
- invite token design,
- privacy limitations,
- responsible disclosure placeholder.

## PRIVACY_MODEL.md
Jelaskan:
- private,
- circle,
- selected members,
- lock,
- admin limitations,
- optional Vault distinction.

## AGENT_DEPLOY_PROMPT.md
Buat prompt terpisah untuk agent deployment yang:
- memeriksa local build,
- membantu login GitHub/Supabase/Vercel bila dibutuhkan,
- tidak pernah meminta user membagikan password,
- menggunakan browser login interaktif,
- membuat Supabase project,
- menjalankan migration,
- mengatur environment,
- deploy preview,
- smoke test,
- deploy production,
- melaporkan URL dan status.

---

# 25. DEFINITION OF DONE

Project baru dianggap selesai bila:

- source code utuh,
- install sukses,
- dev server sukses,
- lint sukses,
- typecheck sukses,
- test utama sukses,
- production build sukses,
- auth bekerja,
- circle bekerja,
- invite bekerja,
- daily report bekerja,
- board drag bekerja,
- schedule bekerja,
- focus session bekerja,
- private resource benar-benar ditolak untuk user lain,
- selected-members sharing bekerja,
- RLS policies tersedia,
- migration tersedia,
- seed/demo tersedia,
- responsive diuji,
- reduced motion tersedia,
- chart lazy-loaded,
- no secret committed,
- README lengkap,
- deployment docs lengkap.

---

# 26. OUTPUT YANG HARUS KAMU HASILKAN

1. Repository project lengkap.
2. Semua source code.
3. SQL migrations dan RLS.
4. Seed/demo data.
5. Automated tests.
6. Documentation.
7. `.env.example`.
8. `BUILD_REPORT.md`.
9. `SECURITY_REVIEW.md`.
10. `UX_QA.md`.
11. ZIP repository final tanpa:
    - `node_modules`,
    - `.next`,
    - secret,
    - local database binary,
    - cache.

Nama ZIP:
`ngambis-production-source.zip`

---

# 27. EKSEKUSI BERTAHAP

Kerjakan dalam urutan:

## Phase 1 — Foundation
- dependency verification,
- repository setup,
- design tokens,
- Supabase clients,
- schema,
- migrations,
- auth,
- RLS.

## Phase 2 — Product shell
- application shell,
- Half-Orbit Dock,
- responsive behavior,
- layout,
- custom scrollbar,
- SVG system.

## Phase 3 — Core features
- Today,
- daily report,
- circle,
- invite,
- Board,
- drag-and-drop,
- privacy selector.

## Phase 4 — Planning
- Rhythm Planner,
- recurring items,
- focus session,
- commitments,
- check-ins,
- nudges.

## Phase 5 — Archive and insight
- archive,
- filters,
- ECharts,
- aggregation,
- export.

## Phase 6 — Hardening
- test,
- RLS verification,
- accessibility,
- performance,
- documentation,
- production build,
- ZIP.

Jangan berhenti setelah satu phase. Lanjutkan sampai repository final selesai.

---

# 28. FINAL RESPONSE FORMAT

Setelah selesai, laporkan:

1. Ringkasan yang dibangun.
2. Tech stack dan versi aktual.
3. Struktur repository.
4. Hasil lint/typecheck/test/build.
5. RLS/security test yang dilakukan.
6. Environment variables yang masih perlu diisi user.
7. Langkah menjalankan lokal.
8. Langkah deploy.
9. Lokasi ZIP final.
10. Limitasi atau hal yang belum sempurna secara jujur.

Jangan mengatakan “selesai” bila build belum diverifikasi.

Mulai kerjakan sekarang.