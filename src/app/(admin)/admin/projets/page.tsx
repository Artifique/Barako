import { listProjectsAdminAction, updateProjectStatusAction } from "@/controllers/project.controller";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectStatuses, type ProjectStatus } from "@/models";

async function setProjectStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!(ProjectStatuses as readonly string[]).includes(status)) return;
  await updateProjectStatusAction(id, status as ProjectStatus);
}

export default async function AdminProjetsPage() {
  const res = await listProjectsAdminAction();
  const projects = res.ok ? res.data : [];

  const columns: { key: string; title: string }[] = [
    { key: "submitted", title: "Soumis" },
    { key: "under_review", title: "En examen" },
    { key: "accepted", title: "Accepté" },
    { key: "mentoring", title: "Mentorat" },
    { key: "funded", title: "Financé" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Projets entrepreneurs</h1>
        <p className="mt-1 text-sm text-slate-600">Faites avancer les dossiers dans le pipeline.</p>
      </div>
      <div className="grid gap-4 overflow-x-auto lg:grid-cols-5">
        {columns.map((col) => (
          <Card glowing key={col.key} className="min-h-[200px]">
            <h2 className="text-sm font-semibold text-slate-800">{col.title}</h2>
            <div className="mt-3 space-y-2">
              {projects
                .filter((p) => p.status === col.key)
                .map((p) => (
                  <div key={p.id} className="rounded-xl border border-slate-100 bg-slate-50/80 p-2 text-xs">
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    <p className="text-slate-500">{p.profiles?.full_name}</p>
                    <form action={setProjectStatus} className="mt-2 space-y-1">
                      <input type="hidden" name="id" value={p.id} />
                      <select name="status" defaultValue={p.status} className="input-field py-1 text-[11px]">
                        <option value="submitted">Soumis</option>
                        <option value="under_review">En examen</option>
                        <option value="accepted">Accepté</option>
                        <option value="mentoring">Mentorat</option>
                        <option value="funded">Financé</option>
                        <option value="rejected">Refusé</option>
                      </select>
                      <Button type="submit" size="sm" className="w-full">
                        Mettre à jour
                      </Button>
                    </form>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
