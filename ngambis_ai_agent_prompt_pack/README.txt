NGAMBIS AI AGENT PROMPT PACK
============================

Isi paket:
1. MASTER_BUILD_PROMPT.md
   Prompt utama untuk coding agent agar membangun project lengkap.

2. AGENT_DEPLOY_PROMPT.md
   Prompt khusus untuk agent yang membantu setup Supabase, GitHub, dan Vercel.

3. REQUIREMENTS_CHECKLIST.md
   Checklist acceptance criteria agar hasil agent tidak setengah jadi.

Cara pakai:
1. Buka MASTER_BUILD_PROMPT.md.
2. Tempel seluruh isinya ke coding agent yang memiliki akses workspace/terminal.
3. Beri agent folder kerja kosong.
4. Biarkan agent membangun sampai lint, test, dan build lolos.
5. Gunakan REQUIREMENTS_CHECKLIST.md untuk audit hasil.
6. Setelah source code selesai, gunakan AGENT_DEPLOY_PROMPT.md untuk agent deployment.

Catatan:
- Jangan memberikan password atau secret melalui chat.
- Gunakan login browser interaktif.
- Pastikan agent tidak commit .env.local.
- Prompt meminta agent menghasilkan ZIP source code final.