import { listUsersAdminAction, setUserActiveAction } from "@/controllers/profile.controller";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function toggleActive(formData: FormData) {
  "use server";
  const userId = String(formData.get("userId"));
  const active = String(formData.get("active")) === "true";
  await setUserActiveAction(userId, active);
}

export default async function AdminUsersPage() {
  const res = await listUsersAdminAction();
  const users = res.ok ? res.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Utilisateurs</h1>
        <p className="mt-1 text-sm text-slate-600">Activation des comptes et vue des rôles.</p>
      </div>
      <Card glowing className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="border-b border-slate-100 p-3">Nom</th>
              <th className="border-b border-slate-100 p-3">Email</th>
              <th className="border-b border-slate-100 p-3">Rôle</th>
              <th className="border-b border-slate-100 p-3">Statut</th>
              <th className="border-b border-slate-100 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-50">
                <td className="p-3 font-medium text-slate-900">{u.full_name ?? "—"}</td>
                <td className="p-3 text-slate-600">{u.email}</td>
                <td className="p-3">
                  <Badge variant="info">{u.role}</Badge>
                </td>
                <td className="p-3 text-slate-600">{u.is_active ? "Actif" : "Inactif"}</td>
                <td className="p-3">
                  <form action={toggleActive} className="inline">
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="active" value={(!u.is_active).toString()} />
                    <Button type="submit" size="sm" variant="outline">
                      {u.is_active ? "Désactiver" : "Activer"}
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
