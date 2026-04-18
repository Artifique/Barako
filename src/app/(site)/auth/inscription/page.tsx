import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { Card } from "@/components/ui/card";

export default function InscriptionPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center">
      <div className="hidden md:block">
        <p className="font-display text-3xl font-bold text-slate-900">Rejoins Baarako</p>
        <p className="mt-3 text-slate-600">Emploi, projet ou entreprise — un seul compte, le bon rôle.</p>
      </div>
      <Card>
        <h1 className="font-display text-2xl font-bold text-slate-900">Inscription</h1>
        <p className="mt-1 text-sm text-slate-600">
          Déjà inscrit ?{" "}
          <Link href="/auth/connexion" className="font-medium text-primary hover:underline">
            Connexion
          </Link>
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
      </Card>
    </div>
  );
}
