import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { Card } from "@/components/ui/card";

export default function ConnexionPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center">
      <div className="hidden md:block">
        <p className="font-display text-3xl font-bold text-slate-900">Bon retour sur Baarako</p>
        <p className="mt-3 text-slate-600">Accède à ton profil, candidatures et formations.</p>
      </div>
      <Card>
        <h1 className="font-display text-2xl font-bold text-slate-900">Connexion</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pas encore de compte ?{" "}
          <Link href="/auth/inscription" className="font-medium text-primary hover:underline">
            S’inscrire
          </Link>
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </Card>
    </div>
  );
}
