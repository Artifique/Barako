import { redirect } from "next/navigation";
import { createClientOptional } from "@/lib/supabase/server";
import * as AvantageService from "@/services/avantage.service";
import * as ProfileService from "@/services/profile.service";

export default async function Page() {
  const supabase = await createClientOptional();
  const { data: { user } } = await (supabase?.auth.getUser() ?? { data: { user: null } });
  
  if (!user) redirect("/auth/connexion?next=/profil/avantages");

  const profileRes = await ProfileService.getCurrentProfile(supabase!);
  const profile = profileRes.ok ? profileRes.data : null;

  if (profile?.role !== 'company') redirect("/profil");

  const avantagesRes = await AvantageService.listAvantages(supabase!);
  const avantages = avantagesRes.ok ? avantagesRes.data : [];

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tighter">
          Vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Avantages Exclusifs</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          En tant que partenaire privilégié, profitez de services premium conçus pour booster votre croissance.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {avantages.map((a: any) => (
          <div key={a.id} className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_60px_rgba(245,124,0,0.2)] transition-all duration-500 hover:-translate-y-3">
            {a.image_url && (
              <div className="h-64 overflow-hidden relative border-b-8 border-primary">
                <img src={a.image_url} alt={a.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
            <div className="p-10 flex-1 flex flex-col">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-5 tracking-tight">{a.title}</h2>
              <p className="text-slate-600 leading-relaxed text-lg flex-1">{a.description}</p>
              
              <div className="mt-10 pt-6 border-t border-slate-100">
                <span className="text-sm font-bold text-primary uppercase tracking-widest italic">Baarako Partner</span>
              </div>
            </div>
          </div>
        ))}
        {avantages.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Aucun avantage n'est disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
