"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProfileEditForm } from "@/components/forms/profile-edit-form";
import { signOut } from "@/controllers/auth.controller";
import Link from "next/link";
import { BesoinsRecrutementModal } from "@/components/modals/besoins-recrutement-modal";

interface ProfilProps {
  profile: any;
  avantages: any[];
}

export default function ProfilPage({ profile, avantages }: ProfilProps) {
  const [showBesoins, setShowBesoins] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Mon Profil</h1>
          <p className="text-slate-500">{profile?.email}</p>
        </div>
        <form action={signOut}>
          <Button variant="ghost" className="rounded-full shadow-md bg-red-500 text-white hover:bg-red-600">Déconnexion</Button>
        </form>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card className="p-6 rounded-3xl shadow-sm border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Informations personnelles</h2>
            {profile && <ProfileEditForm initial={{ full_name: profile.full_name ?? "", phone: profile.phone ?? "", bio: profile.bio ?? "" }} />}
          </Card>
        </div>

        <div className="space-y-8">
          {profile?.role === "company" && (
            <Card className="p-6 rounded-3xl shadow-sm border-slate-100 bg-slate-900 text-white">
              <h2 className="text-xl font-bold mb-6">Pour vous</h2>
              <p className="text-slate-300 text-sm mb-6">
                Accédez à nos services d'accompagnement exclusifs pour le recrutement et le développement de votre entreprise.
              </p>
              <Link href="/profil/besoins" className="w-full">
                  <Button className="w-full mt-8 rounded-full bg-primary hover:bg-orange-600">
                      Exprimer mes besoins
                  </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
