# AgriCore X - Production Runbook

## 1. Prerequisites
- Node.js 18+
- PostgreSQL 13+ (Supabase)
- Edge Functions runtime (Deno)

## 2. Required Environment Variables
Ensure the following are present in Vercel / CI-CD pipeline:
- \`NEXT_PUBLIC_SUPABASE_URL\`: Your Supabase project URL
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`: Supabase anon key
- \`GROQ_API_KEY\`: API key for Groq AI inference

## 3. Migration Sequence
Run migrations strictly in this order to avoid relation failures:
1. \`001_initial_schema.sql\`
2. \`002_rls_policies.sql\`
3. \`003_seed_data.sql\`
4. \`009_create_ai_tables.sql\`
5. \`010_stage6_optimizations.sql\` (Ensure \`pg_cron\` extension is active)

## 4. Deployment Steps
1. \`npm install --production\`
2. \`npm run build\`
3. \`npx supabase db push\`
4. \`npx supabase functions deploy\` (If edge functions are utilized)
5. Vercel deployment (automatically handles \`next build\`)

## 5. Rollback Procedure
If a database migration fails:
1. Execute \`npx supabase db reset\` to drop and reapply all migrations (WARNING: wipes data in dev/staging).
2. For production, revert the codebase to the previous commit and apply a rollback migration script to reverse the specific table schema changes.

## 6. What to Monitor
- **IndexedDB Sync Failures**: Monitor the offline queue size on edge devices.
- **pg_cron Jobs**: Check \`cron.job_run_details\` in the Postgres database to ensure hourly and daily rollups are succeeding.
- **Groq API Quotas**: Monitor the Groq dashboard to avoid rate limiting which would degrade the AI assistant to a skeleton state.
