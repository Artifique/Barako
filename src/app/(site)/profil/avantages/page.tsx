import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function MesAvantagesPage() {
  const supabase = await createClient();
  const { data: avantages, error } = await supabase.from("avantages").select("*");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mes avantages</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {avantages?.map((a: any) => (
          <Card key={a.id} className="p-4 border rounded-lg shadow-sm">
            {a.image_url && <img src={a.image_url} alt={a.title} className="w-full h-32 object-cover mb-4 rounded" />}
            <h2 className="font-semibold text-lg">{a.title}</h2>
            <p className="text-sm text-slate-600 mt-2">{a.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
