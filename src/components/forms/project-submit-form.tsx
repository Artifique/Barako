"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { createProjectAction } from "@/controllers/project.controller";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProjectSubmitForm() {
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    const sector = String(fd.get("sector") ?? "").trim();
    const short_description = String(fd.get("short_description") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    const needs_mentoring = fd.get("needs_mentoring") === "on";
    const needs_funding = fd.get("needs_funding") === "on";
    if (!title || !sector) {
      toast.error("Titre et secteur requis");
      return;
    }
    start(async () => {
      const res = await createProjectAction({
        title,
        sector,
        short_description: short_description || null,
        description: description || null,
        needs_mentoring,
        needs_funding
      });
      if (res.ok) {
        toast.success("Projet soumis");
        (e.target as HTMLFormElement).reset();
      } else toast.error(res.error);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 grid max-w-xl gap-3 rounded-card border border-slate-200 bg-white p-5 shadow-card"
    >
      <Input name="title" placeholder="Titre du projet" required />
      <Input name="sector" placeholder="Secteur (ex. Agriculture)" required />
      <textarea name="short_description" rows={2} placeholder="Résumé court" className="input-field" />
      <textarea name="description" rows={4} placeholder="Description détaillée" className="input-field" />
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="needs_mentoring" className="accent-primary" />
        Besoin de mentorat
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="needs_funding" className="accent-primary" />
        Recherche de financement
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Soumettre"}
      </Button>
    </form>
  );
}
