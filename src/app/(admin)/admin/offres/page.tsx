import { listOffersAdminAction, updateJobOfferAction } from "@/controllers/job-offer.controller";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function setOfferStatus(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  await updateJobOfferAction(id, { status });
}

export default async function AdminOffresPage() {
  const res = await listOffersAdminAction();
  const offers = res.ok ? res.data : [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-light">Offres d’emploi</h1>
      <Card variant="dark" className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-text-muted">
            <tr>
              <th className="p-3">Titre</th>
              <th className="p-3">Entreprise</th>
              <th className="p-3">Lieu</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id} className="border-t border-white/5">
                <td className="p-3 text-light">{o.title}</td>
                <td className="p-3 text-text-muted">{o.companies?.name}</td>
                <td className="p-3 text-text-muted">{o.location}</td>
                <td className="p-3">
                  <Badge variant="gold">{o.status}</Badge>
                </td>
                <td className="p-3">
                  <form action={setOfferStatus} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={o.id} />
                    <select
                      name="status"
                      defaultValue={o.status}
                      className="rounded-lg border border-white/10 bg-dark/60 px-2 py-1 text-xs text-light"
                    >
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                      <option value="closed">closed</option>
                    </select>
                    <Button type="submit" size="sm">
                      Mettre à jour
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
