import Link from "next/link";
import Image from "next/image"; // Import Image component
import { RegisterForm } from "@/components/forms/register-form";
import { Card } from "@/components/ui/card";

export default function InscriptionPage() {
  const primaryOrange = "#F57C00"; // Main orange from logo
  const darkBlue = "#0D47A1";     // Dark blue from logo
  const lightOrange = "#FFA726";  // Light orange from logo
  const darkGreen = "#2E8B57";    // Dark green from logo

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Background Shapes Design */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[10%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] h-[40vw] w-[40vw] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[30vw] w-[30vw] rounded-full bg-orange-400/10 blur-[100px]" />
        {/* Motif géométrique subtil en overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#F57C00 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center">
        {/* Mobile image - Visible only on small screens */}
        <div className="relative block h-64 w-full md:hidden">
          <Image src="/signin.png" alt="Illustration" fill className="rounded-xl object-contain drop-shadow-lg" priority />
        </div>

        {/* Right side: Form */}
        <Card className="border-l-4 border-l-[color:var(--primary-orange)] shadow-2xl backdrop-blur-sm bg-white/80" style={{ '--primary-orange': primaryOrange } as React.CSSProperties}>
          <h1 className="font-display text-2xl font-bold text-slate-900" style={{ color: darkBlue }}>
            Inscription
          </h1>
          <p className="mt-1 text-sm leading-relaxed">
            Déjà inscrit ?{" "}
            <Link href="/auth/connexion" className="font-medium hover:underline" style={{ color: primaryOrange }}>
              Connexion
            </Link>
          </p>
          <div className="mt-6">
            <RegisterForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
