"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { updateMyProfileAction } from "@/controllers/profile.controller";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileEditForm({
  initial
}: {
  initial: { full_name: string; phone: string; bio: string };
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await updateMyProfileAction({
        full_name: String(fd.get("full_name") ?? ""),
        phone: String(fd.get("phone") ?? "") || null,
        bio: String(fd.get("bio") ?? "") || null
      });
      if (res.ok) {
        toast.success("Profil mis à jour");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="text-xs font-medium text-slate-600">Nom complet</label>
        <Input name="full_name" defaultValue={initial.full_name} className="mt-1" required />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-600">Téléphone</label>
        <Input name="phone" defaultValue={initial.phone} className="mt-1" />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs font-medium text-slate-600">Bio</label>
        <textarea name="bio" defaultValue={initial.bio} rows={3} className="input-field mt-1" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
