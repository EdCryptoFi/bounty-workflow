import { NextResponse } from "next/server";

/**
 * POST /api/setup/activation-codes
 * One-time setup endpoint to create the activation_codes table.
 * Protected by SUPABASE_SERVICE_ROLE_KEY check.
 *
 * After running, the table will exist and the admin/codes page will work.
 *
 * USAGE: Run this SQL directly in Supabase SQL Editor instead.
 * This route is just a reference/documentation endpoint.
 */
export async function POST(request: Request) {
  // Only allow if Authorization header matches service role key
  const authHeader = request.headers.get("authorization");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  return NextResponse.json({
    message: "Execute o SQL abaixo no Supabase SQL Editor (https://supabase.com/dashboard/project/kjjaymadgmfmrvkraian/sql/new)",
    sql: MIGRATION_SQL,
  });
}

const MIGRATION_SQL = `
-- =====================================================================
-- Activation Codes — trial extension codes managed by admin
-- =====================================================================

create table if not exists public.activation_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  days_free integer not null default 7 check (days_free > 0 and days_free <= 365),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz
);

create index if not exists activation_codes_code_idx on public.activation_codes(code);
create index if not exists activation_codes_used_by_idx on public.activation_codes(used_by);

alter table public.activation_codes enable row level security;
alter table public.activation_codes force row level security;

-- Only admins can manage codes
drop policy if exists activation_codes_admin_all on public.activation_codes;
create policy activation_codes_admin_all on public.activation_codes
  for all
  using (public.is_admin());

-- Users can read only their own used code (to display in settings)
drop policy if exists activation_codes_user_select on public.activation_codes;
create policy activation_codes_user_select on public.activation_codes
  for select
  using (used_by = auth.uid());

-- Add applied_code_id to users table to track which code was applied
alter table public.users
  add column if not exists applied_code_id uuid references public.activation_codes(id) on delete set null;

-- Also add banned_at column for user management
alter table public.users
  add column if not exists banned_at timestamptz default null;
`;

export async function GET() {
  return NextResponse.json({
    info: "POST com Authorization: Bearer <SERVICE_ROLE_KEY> para ver o SQL, ou copie do arquivo supabase/migrations/20260504000001_activation_codes.sql"
  });
}
