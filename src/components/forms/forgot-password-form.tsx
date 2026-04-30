"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast.error("Erreur lors de l'envoi de l'e-mail : " + error.message);
    } else {
      toast.success("E-mail de réinitialisation envoyé avec succès.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Votre adresse e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Envoi en cours..." : "Réinitialiser mon mot de passe"}
      </Button>
      <div className="text-center mt-4">
        <Link href="/auth/connexion" className="text-sm text-primary hover:underline">
          Retour à la connexion
        </Link>
      </div>
    </form>
  );
}
