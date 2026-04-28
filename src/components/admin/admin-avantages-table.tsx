"use client";

import { Avantage } from "@/models/avantage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AdminAvantagesTableProps = {
  avantages: Avantage[];
  onEdit: (avantage: Avantage) => void;
  onDelete: (avantageId: string) => void;
};

export function AdminAvantagesTable({ avantages, onEdit, onDelete }: AdminAvantagesTableProps) {
  return (
    <Card glowing> {/* Je rétablis le prop 'glowing' */}
      <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Liste des Avantages</h2>
      {avantages.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">Aucun avantage enregistré.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {avantages.map((avantage) => (
                <tr key={avantage.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {avantage.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {avantage.description.substring(0, 50)}{avantage.description.length > 50 ? '...' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {avantage.image_url ? (
                      <img src={avantage.image_url} alt={avantage.title} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      "Pas d'image"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(avantage)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      Éditer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(avantage.id)}
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
