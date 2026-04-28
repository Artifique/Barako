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
  return (
    <Card glowing>
      <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Entreprises existantes</h2>
      {companies.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">Aucune entreprise enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propriétaire
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Site web
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.owner_id ? company.owner_id.slice(0, 8) + '...' : 'N/A'} {/* Afficher l'ID du propriétaire, ou son nom si disponible */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.location || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.website ? <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">{company.website}</a> : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(company)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Éditer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(company.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
