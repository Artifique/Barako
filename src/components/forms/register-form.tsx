"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUpWithEmail, type AuthFormState } from "@/controllers/auth.controller";
import type { UserRole } from "@/models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect } from "react";
import { StatusModal } from "@/components/modals/status-modal";
import { useRouter } from "next/navigation";

// Types pour les champs du PDF ...
type Gender = "male" | "female" | "other";
type CurrentSituation = "unemployed" | "student" | "active" | "apprentice" | "other";
type StudyLevel = "none" | "primary" | "secondary" | "technical" | "university";
type ProfessionalExperience = "none" | "yes";
type ApplicationType = "job_search" | "project_creation" | "both";
type Skill = "sales_commerce" | "btp" | "mechanics" | "hairdressing_aesthetics" | "cooking_catering" | "it" | "cleaning_services" | "other";
type Availability = "immediate" | "one_week" | "one_month";
type CompanyType = "very_small" | "sme" | "large";


const initial: AuthFormState = {};

const roles: { id: UserRole; label: string; emoji: string }[] = [
  { id: "job_seeker", label: "Je cherche un emploi", emoji: "👤" },
  { id: "entrepreneur", label: "Je suis porteur de projet", emoji: "💡" },
  { id: "company", label: "Je suis une entreprise", emoji: "🏢" }
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Création…" : "Créer mon compte"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(signUpWithEmail, initial);
  const [selectedRole, setSelectedRole] = useState<UserRole>("job_seeker");
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (state?.error || state?.success) {
      setShowStatus(true);
    }
  }, [state]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(event.target.value as UserRole);
  };
  
  // ... (states for experience, study level, company type) ...

  const [hasProfessionalExperience, setHasProfessionalExperience] = useState<ProfessionalExperience>("none");
  const handleExperienceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasProfessionalExperience(event.target.value as ProfessionalExperience);
  };

  const [selectedStudyLevel, setSelectedStudyLevel] = useState<StudyLevel>("none");
  const handleStudyLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStudyLevel(event.target.value as StudyLevel);
  };

  const [selectedCompanyType, setSelectedCompanyType] = useState<CompanyType>("very_small");
  const handleCompanyTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCompanyType(event.target.value as CompanyType);
  };

  const router = useRouter();
  return (
    <form action={formAction} className="space-y-4">
      <StatusModal 
        open={showStatus} 
        onOpenChange={(open) => {
            setShowStatus(open);
            if (!open && state?.success) {
                router.push("/");
            }
        }}
        title={state?.error ? "Une erreur est survenue" : "Inscription réussie !"}
        message={state?.error || state?.success || ""}
        isError={!!state?.error}
      />
      
      <div>
        <label className="text-xs font-medium text-slate-600">Nom complet</label>
        <Input name="full_name" required className="mt-1" autoComplete="name" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Email</label>
        <Input name="email" type="email" required className="mt-1" autoComplete="email" />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Mot de passe</label>
        <Input name="password" type="password" required className="mt-1" autoComplete="new-password" />
      </div>
      <fieldset>
        <legend className="text-xs font-medium text-slate-600">Rôle</legend>
        <div className="mt-2 grid gap-2">
          {roles.map((r) => (
            <label
              key={r.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 transition hover:border-primary/40 hover:bg-white",
                selectedRole === r.id && "border-primary/40 ring-1 ring-primary/15"
              )}
            >
              <input
                type="radio"
                name="role"
                value={r.id}
                checked={selectedRole === r.id}
                onChange={handleRoleChange}
                className="accent-primary"
              />
              <span className="text-lg">{r.emoji}</span>
              <span className="text-sm text-slate-800">{r.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {/* ... reste du formulaire ... */}


      {selectedRole === "job_seeker" || selectedRole === "entrepreneur" ? (
        <>
          <h3 className="text-md font-semibold text-slate-800 pt-4">Informations personnelles</h3>
          <div>
            <label className="text-xs font-medium text-slate-600">Date de naissance</label>
            <Input name="dob" type="date" className="mt-1" />
          </div>
          <fieldset>
            <legend className="text-xs font-medium text-slate-600">Sexe</legend>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="radio" name="gender" value="male" className="accent-primary" /> Homme
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="radio" name="gender" value="female" className="accent-primary" /> Femme
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="radio" name="gender" value="other" className="accent-primary" /> Autre
              </label>
            </div>
          </fieldset>
          <div>
            <label className="text-xs font-medium text-slate-600">Téléphone</label>
            <Input name="phone" type="tel" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Commune / Quartier</label>
            <Input name="location" className="mt-1" />
          </div>

          <h3 className="text-md font-semibold text-slate-800 pt-4">Situation actuelle</h3>
          <fieldset>
            <legend className="text-xs font-medium text-slate-600">Situation</legend>
            <div className="mt-2 grid gap-2">
              {["unemployed", "student", "active", "apprentice", "other"].map((situation) => (
                <label key={situation} className="flex items-center gap-2 text-sm text-slate-800">
                  <input type="radio" name="current_situation" value={situation} className="accent-primary" /> {situation === "unemployed" ? "Sans emploi" : situation === "student" ? "Étudiant(e)" : situation === "active" ? "En activité" : situation === "apprentice" ? "Apprenti(e)" : "Autre"}
                </label>
              ))}
            </div>
          </fieldset>

          <h3 className="text-md font-semibold text-slate-800 pt-4">Niveau d'étude</h3>
          <fieldset>
            <legend className="text-xs font-medium text-slate-600">Niveau</legend>
            <div className="mt-2 grid gap-2">
              {["none", "primary", "secondary", "technical", "university"].map((level) => (
                <label key={level} className="flex items-center gap-2 text-sm text-slate-800">
                  <input type="radio" name="study_level" value={level} checked={selectedStudyLevel === level} onChange={handleStudyLevelChange} className="accent-primary" /> {level === "none" ? "Aucun" : level === "primary" ? "Primaire" : level === "secondary" ? "Secondaire" : level === "technical" ? "Technique / Professionnel" : "Universitaire"}
                </label>
              ))}
            </div>
          </fieldset>
          {(selectedStudyLevel === "technical" || selectedStudyLevel === "university") && (
            <div>
              <label className="text-xs font-medium text-slate-600">Domaine d'étude</label>
              <Input name="study_field" className="mt-1" />
            </div>
          )}

          <h3 className="text-md font-semibold text-slate-800 pt-4">Expérience professionnelle</h3>
          <fieldset>
            <legend className="text-xs font-medium text-slate-600">Avez-vous de l'expérience ?</legend>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="radio" name="has_professional_experience" value="none" checked={hasProfessionalExperience === "none"} onChange={handleExperienceChange} className="accent-primary" /> Aucune
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="radio" name="has_professional_experience" value="yes" checked={hasProfessionalExperience === "yes"} onChange={handleExperienceChange} className="accent-primary" /> Oui
              </label>
            </div>
          </fieldset>
          {hasProfessionalExperience === "yes" && (
            <>
              <div>
                <label className="text-xs font-medium text-slate-600">Métier</label>
                <Input name="job_title" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Durée (années)</label>
                <Input name="experience_duration" type="number" className="mt-1" />
              </div>
            </>
          )}

          <h3 className="text-md font-semibold text-slate-800 pt-4">Type de candidature</h3>
          <fieldset>
            <legend className="text-xs font-medium text-slate-600">Je souhaite :</legend>
            <div className="mt-2 grid gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="checkbox" name="application_type" value="job_search" className="accent-primary" /> Rechercher un emploi salarié (Bourse Baarako)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="checkbox" name="application_type" value="project_creation" className="accent-primary" /> Créer une activité (Bourse Tchakèda)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="checkbox" name="application_type" value="both" className="accent-primary" /> Les deux
              </label>
            </div>
          </fieldset>

          <h3 className="text-md font-semibold text-slate-800 pt-4">Compétences</h3>
          <fieldset>
            <legend className="text-xs font-medium text-slate-600">Mes domaines de compétences :</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["sales_commerce", "btp", "mechanics", "hairdressing_aesthetics", "cooking_catering", "it", "cleaning_services", "other"].map((skill) => (
                <label key={skill} className="flex items-center gap-2 text-sm text-slate-800">
                  <input type="checkbox" name="skills" value={skill} className="accent-primary" /> {skill === "sales_commerce" ? "Vente / Commerce" : skill === "btp" ? "BTP" : skill === "mechanics" ? "Mécanique" : skill === "hairdressing_aesthetics" ? "Coiffure / Esthétique" : skill === "cooking_catering" ? "Cuisine / Restauration" : skill === "it" ? "Informatique" : skill === "cleaning_services" ? "Nettoyage / Services" : "Autre"}
                </label>
              ))}
            </div>
          </fieldset>

          <h3 className="text-md font-semibold text-slate-800 pt-4">Disponibilité</h3>
          <fieldset>
            <legend className="text-xs font-medium text-slate-600">Quand êtes-vous disponible ?</legend>
            <div className="mt-2 flex gap-4">
              {["immediate", "one_week", "one_month"].map((availability) => (
                <label key={availability} className="flex items-center gap-2 text-sm text-slate-800">
                  <input type="radio" name="availability" value={availability} className="accent-primary" /> {availability === "immediate" ? "Immédiate" : availability === "one_week" ? "Dans 1 semaine" : "Dans 1 mois"}
                </label>
              ))}
            </div>
          </fieldset>
        </>
      ) : selectedRole === "company" ? (
        <>
          <h3 className="text-md font-semibold text-slate-800 pt-4">Informations de l'entreprise</h3>
          <div>
            <label className="text-xs font-medium text-slate-600">Nom de l'entreprise</label>
            <Input name="company_name" required className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Secteur d'activité</label>
            <Input name="company_sector" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Adresse</label>
            <Input name="company_address" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Téléphone de l'entreprise</label>
            <Input name="company_phone" type="tel" className="mt-1" />
          </div>

          <h3 className="text-md font-semibold text-slate-800 pt-4">Informations du responsable</h3>
          <div>
            <label className="text-xs font-medium text-slate-600">Nom et prénom du responsable</label>
            <Input name="responsible_name" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Fonction du responsable</label>
            <Input name="responsible_function" className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Téléphone du responsable</label>
            <Input name="responsible_phone" type="tel" className="mt-1" />
          </div>

          <h3 className="text-md font-semibold text-slate-800 pt-4">Type d'entreprise</h3>
          <fieldset>
            <legend className="text-xs font-medium text-slate-600">Quel est le type de votre entreprise ?</legend>
            <div className="mt-2 grid gap-2">
              {["very_small", "sme", "large"].map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm text-slate-800">
                  <input type="radio" name="company_type" value={type} checked={selectedCompanyType === type} onChange={handleCompanyTypeChange} className="accent-primary" /> {type === "very_small" ? "Très petite entreprise (1-5 employés)" : type === "sme" ? "PME (5-50 employés)" : "Grande entreprise"}
                </label>
              ))}
            </div>
          </fieldset>
        </>
      ) : null}

      <div className="mt-4 border-t border-slate-200 pt-4">
        <h3 className="text-md font-semibold text-slate-800">Engagement</h3>
        <p className="mt-2 text-sm text-slate-600">
          Je m'engage à participer aux formations, respecter les règles du programme et être sérieux.
          {selectedRole === "company" && " Et à collaborer avec les jeunes entrepreneurs."}
        </p>
        <label className="flex items-center gap-2 text-sm text-slate-800 mt-2">
          <input type="checkbox" name="agreement" required className="accent-primary" /> J'accepte les termes et conditions
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}