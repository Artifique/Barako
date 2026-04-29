"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Company } from "@/models/company";
import { ServiceResult } from "@/models/service-result";
import { Profile } from "@/models/profile";

import { createCompanyAction, updateCompanyAsAdminAction } from "@/controllers/company.controller";

type CompanyCrudFormProps = {
  initialCompany?: Company;
  companyOwners: Profile[];
  onSubmitSuccess?: () => void;
};

const SubmitButton = ({ isEditMode }: { isEditMode: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? (isEditMode ? "Sauvegarde en cours..." : "Création en cours...") : (isEditMode ? "Sauvegarder" : "Créer")}
    </Button>
  );
};

export function CompanyCrudForm({ initialCompany, companyOwners, onSubmitSuccess }: CompanyCrudFormProps) {
  const isEditMode = !!initialCompany;

  const [name, setName] = useState(initialCompany?.name || "");
  const [sector, setSector] = useState(initialCompany?.sector || "");
  const [email, setEmail] = useState(initialCompany?.email || "");
  const [responsibleName, setResponsibleName] = useState(initialCompany?.responsible_name || "");
  const [responsibleFunction, setResponsibleFunction] = useState(initialCompany?.responsible_function || "");
  const [responsiblePhone, setResponsiblePhone] = useState(initialCompany?.responsible_phone || "");
  const [companyType, setCompanyType] = useState(initialCompany?.company_type || "");

  useEffect(() => {
    if (initialCompany) {
      setName(initialCompany.name || "");
      setSector(initialCompany.sector || "");
      setEmail(initialCompany.email || "");
      setResponsibleName(initialCompany.responsible_name || "");
      setResponsibleFunction(initialCompany.responsible_function || "");
      setResponsiblePhone(initialCompany.responsible_phone || "");
      setCompanyType(initialCompany.company_type || "");
    }
  }, [initialCompany]);

  const formSubmitAction = async (prevState: ServiceResult<Company | null>, formData: FormData): Promise<ServiceResult<Company | null>> => {
    const companyInput = {
      name,
      sector: sector || null,
      email: email || null,
      responsible_name: responsibleName || null,
      responsible_function: responsibleFunction || null,
      responsible_phone: responsiblePhone || null,
      company_type: companyType || null,
    };

    if (isEditMode && initialCompany) {
      return updateCompanyAsAdminAction(initialCompany.id, companyInput);
    } else {
      return createCompanyAction(companyInput);
    }
  };

  const [state, formAction] = useFormState<ServiceResult<Company | null>, FormData>(
    formSubmitAction,
    { ok: true, data: initialCompany || null }
  );

  useEffect(() => {
    if (state.ok && state.data) {
      toast.success(`Entreprise ${isEditMode ? "mise à jour" : "créée"} avec succès !`);
      onSubmitSuccess?.();
      if (!isEditMode) {
        setName("");
        setSector("");
        setEmail("");
        setResponsibleName("");
        setResponsibleFunction("");
        setResponsiblePhone("");
        setCompanyType("");
      }
    } else if (!state.ok && state.error) {
      toast.error(state.error);
    }
  }, [state, isEditMode, onSubmitSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
        <Input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Raison sociale"
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
        <Input
          id="sector"
          name="sector"
          type="text"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          placeholder="Ex: Informatique, BTP..."
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email de l'entreprise</label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@entreprise.com"
          className="mt-1 block w-full"
        />
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Informations du responsable</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="responsible_name" className="block text-sm font-medium text-gray-700">Nom & prénom</label>
            <Input
              id="responsible_name"
              name="responsible_name"
              type="text"
              value={responsibleName}
              onChange={(e) => setResponsibleName(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="responsible_function" className="block text-sm font-medium text-gray-700">Fonction</label>
            <Input
              id="responsible_function"
              name="responsible_function"
              type="text"
              value={responsibleFunction}
              onChange={(e) => setResponsibleFunction(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="responsible_phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
            <Input
              id="responsible_phone"
              name="responsible_phone"
              type="tel"
              value={responsiblePhone}
              onChange={(e) => setResponsiblePhone(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="company_type" className="block text-sm font-medium text-gray-700">Type d'entreprise</label>
        <select
          id="company_type"
          name="company_type"
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          className="input-field mt-1 block w-full"
        >
          <option value="">— Choisir —</option>
          <option value="TPE">Très petite entreprise (1–5 employés)</option>
          <option value="PME">PME (5–50 employés)</option>
          <option value="Grande">Grande entreprise</option>
        </select>
      </div>

      <SubmitButton isEditMode={isEditMode} />
    </form>
  );
}
