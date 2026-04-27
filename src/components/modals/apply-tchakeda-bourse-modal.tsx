"use client";

import { useState, useTransition, type ReactNode } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { AdminModal } from "@/components/admin/admin-modal";
import { applyToTchakedaBourseAction } from "@/controllers/job-application.controller"; // Cette action sera créée plus tard

interface ApplyTchakedaBourseModalProps {
  jobOfferId: string;
  onApplied: () => void; // Callback à appeler après une candidature réussie
}

export function ApplyTchakedaBourseModal({ jobOfferId, onApplied }: ApplyTchakedaBourseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const has_activity_idea = fd.get("has_activity_idea") === "yes";
    const has_exercised_before = fd.get("has_exercised_before") === "yes";

    startTransition(async () => {
      const res = await applyToTchakedaBourseAction(jobOfferId, {
        has_activity_idea,
        has_exercised_before,
      });

      if (res.ok) {
        toast.success("Candidature à la bourse Tchakèda envoyée !");
        setIsOpen(false);
        onApplied();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <AdminModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Postuler à la bourse Tchakèda"
      description="Répondez à ces quelques questions pour votre candidature."
      footer={
        <Button type="submit" className="w-full" disabled={pending} form="tchakeda-bourse-form">
          {pending ? "Envoi…" : "Envoyer ma candidature"}
        </Button>
      }
    >
      <form id="tchakeda-bourse-form" onSubmit={onSubmit} className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Avez-vous une idée d'activité ?</legend>
          <div className="flex items-center space-x-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="has_activity_idea" value="yes" required className="accent-primary" /> Oui
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="has_activity_idea" value="no" required className="accent-primary" /> Non
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Avez-vous déjà exercé cette activité ?</legend>
          <div className="flex items-center space-x-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="has_exercised_before" value="yes" required className="accent-primary" /> Oui
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="has_exercised_before" value="no" required className="accent-primary" /> Non
            </label>
          </div>
        </fieldset>
      </form>
    </AdminModal>
  );
}