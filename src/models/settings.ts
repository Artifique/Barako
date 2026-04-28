export type Settings = {
  id: string;
  data: Record<string, any>; // Utilise Record<string, any> pour un objet JSON flexible
  created_at: string;
  updated_at: string;
};

// Optionnel: Type pour la mise à jour, si jamais on veut une validation plus stricte
export type UpdateSettings = Partial<Omit<Settings, 'id' | 'created_at' | 'updated_at'>>;
