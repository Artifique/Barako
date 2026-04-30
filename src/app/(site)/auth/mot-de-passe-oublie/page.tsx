import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold mb-6 text-center">Mot de passe oublié</h1>
        <p className="text-sm text-slate-600 mb-6 text-center">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
        </p>
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}
