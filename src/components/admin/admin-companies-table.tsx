"use client";

import { useState } from "react";
import { Company } from "@/models/company";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AdminCompaniesTableProps = {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
};

export function AdminCompaniesTable({ companies, onEdit, onDelete }: AdminCompaniesTableProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedCompanies = companies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Card glowing>
      <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Entreprises enregistrées</h2>
      {companies.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">Aucune entreprise enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCompanies.map((c: any) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.responsible_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.location || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.responsible_phone || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 flex gap-2 border-t">
              <Button disabled={page === 1} onClick={() => setPage(page-1)}>Précédent</Button>
              <Button disabled={page * itemsPerPage >= companies.length} onClick={() => setPage(page+1)}>Suivant</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
