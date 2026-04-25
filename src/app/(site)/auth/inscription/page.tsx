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
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center">
      {/* Left side: Display signin.png image - Removed 'hidden md:block' for responsiveness */}
      <div className="relative p-8"> {/* Removed 'hidden md:block' */}
        <Image
          src="/signin.png" // Use signin.png as requested
          alt="Illustration d'inscription"
          width={500} // Adjust width as needed
          height={500} // Adjust height as needed
          className="h-auto w-full rounded-xl object-contain drop-shadow-xl"
          priority
        />
      </div>
      <Card className="border-l-4 border-l-[color:var(--primary-orange)]" style={{ '--primary-orange': primaryOrange } as React.CSSProperties}>
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
  );
}
