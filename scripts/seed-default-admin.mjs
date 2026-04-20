/**
 * Crée (ou met à jour) un compte administrateur via l’API Admin Supabase.
 *
 * Prérequis dans l’environnement :
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (Dashboard → Project Settings → API → service_role — jamais côté client)
 *   ADMIN_EMAIL                (optionnel, défaut : fombadaouda72@gmail.com)
 *   ADMIN_PASSWORD             (obligatoire — ne pas commiter ce mot de passe)
 *
 * Exemple PowerShell :
 *   $env:NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   $env:ADMIN_PASSWORD="daouda@2026"
 *   node scripts/seed-default-admin.mjs
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.ADMIN_EMAIL ?? "fombadaouda72@gmail.com").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error("Variables manquantes : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!password) {
  console.error("Variable manquante : ADMIN_PASSWORD (mot de passe du compte admin).");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const { data: created, error: createErr } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: "Administrateur", role: "admin" }
});

if (createErr) {
  const msg = createErr.message ?? "";
  if (/already|exists|registered/i.test(msg)) {
    console.log("Compte déjà présent dans Auth. Mise à jour du mot de passe et du profil…");
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) {
      console.error(listErr.message);
      process.exit(1);
    }
    const u = list.users.find((x) => (x.email ?? "").toLowerCase() === email);
    if (!u) {
      console.error("Utilisateur introuvable pour cet e-mail.");
      process.exit(1);
    }
    const { error: updAuth } = await supabase.auth.admin.updateUserById(u.id, {
      password,
      email_confirm: true,
      user_metadata: { ...u.user_metadata, full_name: "Administrateur", role: "admin" }
    });
    if (updAuth) {
      console.error("Mise à jour Auth :", updAuth.message);
      process.exit(1);
    }
    const { error: updProf } = await supabase.from("profiles").update({ role: "admin" }).eq("id", u.id);
    if (updProf) {
      console.error("Mise à jour profil :", updProf.message);
      process.exit(1);
    }
    console.log("OK — compte mis à jour :", email, "| id :", u.id);
    console.log("Connecte-toi sur l’app puis ouvre /admin ou le lien « Administration ».");
    process.exit(0);
  }
  console.error("createUser :", createErr.message);
  process.exit(1);
}

const id = created.user.id;
const { error: profErr } = await supabase.from("profiles").update({ role: "admin" }).eq("id", id);
if (profErr) {
  console.warn("Compte Auth créé mais profil :", profErr.message, "(le trigger a peut‑être déjà mis role=admin.)");
} else {
  console.log("Profil mis à jour en admin.");
}

console.log("OK — administrateur créé :", email, "| id :", id);
console.log("Connecte-toi sur l’app puis ouvre /admin ou le lien « Administration ».");
