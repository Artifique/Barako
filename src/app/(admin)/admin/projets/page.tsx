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
      <h1 className="font-display text-2xl font-bold text-light">Projets entrepreneurs</h1>
      <div className="grid gap-4 overflow-x-auto lg:grid-cols-5">
        {columns.map((col) => (
          <Card variant="dark" key={col.key} className="min-h-[200px]">
            <h2 className="text-sm font-semibold text-light">{col.title}</h2>
            <div className="mt-3 space-y-2">
              {projects
                .filter((p) => p.status === col.key)
                .map((p) => (
                  <div key={p.id} className="rounded-lg border border-white/10 bg-dark/50 p-2 text-xs">
                    <p className="font-medium text-light">{p.title}</p>
                    <p className="text-text-muted">{p.profiles?.full_name}</p>
                    <form action={setProjectStatus} className="mt-2 space-y-1">
                      <input type="hidden" name="id" value={p.id} />
                      <select
                        name="status"
                        defaultValue={p.status}
                        className="w-full rounded border border-white/10 bg-dark px-1 py-1 text-[11px] text-light"
                      >
                        <option value="submitted">submitted</option>
                        <option value="under_review">under_review</option>
                        <option value="accepted">accepted</option>
                        <option value="mentoring">mentoring</option>
                        <option value="funded">funded</option>
                        <option value="rejected">rejected</option>
                      </select>
                      <Button type="submit" size="sm" className="w-full">
                        OK
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
