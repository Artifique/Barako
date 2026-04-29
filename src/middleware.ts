import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  // 1. Vérifier le mode maintenance
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: setting, error } = await supabase
    .from("settings")
    .select("data")
    .limit(1)
    .single();

  const isMaintenance = error ? false : setting?.data?.maintenance_mode === true;
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  if (isMaintenance && !isAdminPath && !request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
