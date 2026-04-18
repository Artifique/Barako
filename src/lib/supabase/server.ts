import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key, ok: !!(url && key) };
}

async function createServerInner(): Promise<SupabaseClient> {
  const { url, key } = getEnv();
  const cookieStore = await cookies();
  return createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* Server Component : cookies en lecture seule */
        }
      }
    }
  });
}

/** Client Supabase serveur — exige les variables d’environnement. */
export async function createClient(): Promise<SupabaseClient> {
  if (!getEnv().ok) {
    throw new Error(
      "Supabase non configuré : définir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY (voir .env.example)."
    );
  }
  return createServerInner();
}

/** Même client, ou null si l’env n’est pas prêt (navigation dégradée sans crash). */
export async function createClientOptional(): Promise<SupabaseClient | null> {
  if (!getEnv().ok) return null;
  return createServerInner();
}
