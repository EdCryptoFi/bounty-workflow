/**
 * Script para criar/resetar o usuário admin no Supabase Auth.
 * Rodar uma vez: npx tsx scripts/ensure-admin.ts
 *
 * Requer as variáveis de ambiente do .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually without dotenv
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim();
  if (!process.env[key]) process.env[key] = value;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const ADMIN_EMAIL = "bountyworkflow@proton.me";
const ADMIN_PASSWORD = "Cr3ptomo3das!@#";

async function main() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("❌ Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Tentar encontrar o usuário pelo email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error("❌ Erro ao listar usuários:", listError.message);
    process.exit(1);
  }

  const existingUser = users.find((u) => u.email === ADMIN_EMAIL);

  if (existingUser) {
    // Atualizar a senha do usuário existente
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password: ADMIN_PASSWORD,
        email_confirm: true,
      }
    );
    if (updateError) {
      console.error("❌ Erro ao atualizar admin:", updateError.message);
      process.exit(1);
    }
    console.log(`✅ Senha do admin (${ADMIN_EMAIL}) atualizada com sucesso!`);
  } else {
    // Criar o usuário
    const { error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (createError) {
      console.error("❌ Erro ao criar admin:", createError.message);
      process.exit(1);
    }
    console.log(`✅ Admin (${ADMIN_EMAIL}) criado com sucesso!`);
  }
}

main();
