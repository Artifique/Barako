import { createFormationAdminAction, listFormationsAdminAction } from "@/controllers/formation.controller";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FormationType } from "@/models";

async function createFormation(formData: FormData) {
  "use server";
  await createFormationAdminAction({
    title: String(formData.get("title")),
    type: String(formData.get("type")) as FormationType,
    description: String(formData.get("description") || "") || null,
    start_date: String(formData.get("start_date")),
    end_date: String(formData.get("end_date") || "") || null,
    duration_days: Number(formData.get("duration_days") || 1),
    location: String(formData.get("location") || "Bamako"),
    max_places: Number(formData.get("max_places") || 30)
  });
}

export default async function AdminFormationsPage() {
  const res = await listFormationsAdminAction();
  const formations = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-light">Formations</h1>
      <Card variant="dark">
        <h2 className="font-display text-lg font-semibold text-light">Nouvelle formation</h2>
        <form action={createFormation} className="mt-4 grid max-w-xl gap-3">
          <input
            name="title"
            required
            placeholder="Titre"
            className="rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-sm text-light"
          />
          <select
            name="type"
            className="rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-sm text-light"
            defaultValue="employability"
          >
            <option value="employability">Employabilité</option>
            <option value="entrepreneurship">Entrepreneuriat</option>
          </select>
          <textarea
            name="description"
            rows={3}
            placeholder="Description"
            className="rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-sm text-light"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="date"
              name="start_date"
              required
              className="rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-sm text-light"
            />
            <input
              type="date"
              name="end_date"
              className="rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-sm text-light"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="duration_days"
              type="number"
              min={1}
              defaultValue={5}
              className="rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-sm text-light"
            />
            <input
              name="max_places"
              type="number"
              min={1}
              defaultValue={25}
              className="rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-sm text-light"
            />
          </div>
          <input
            name="location"
            placeholder="Lieu"
            defaultValue="Bamako"
            className="rounded-lg border border-white/10 bg-dark/60 px-3 py-2 text-sm text-light"
          />
          <Button type="submit">Créer</Button>
        </form>
      </Card>
      <Card variant="dark">
        <h2 className="font-display text-lg font-semibold text-light">Liste</h2>
        <ul className="mt-4 space-y-2 text-sm text-light/85">
          {formations.map((f) => (
            <li key={f.id} className="rounded border border-white/10 bg-dark/40 px-3 py-2">
              {f.title} — {f.type} — {f.start_date}
            </li>
          ))}
          {formations.length === 0 && <li className="text-text-muted">Aucune formation.</li>}
        </ul>
      </Card>
    </div>
  );
}
