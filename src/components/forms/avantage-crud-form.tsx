"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ServiceResult } from "@/models/service-result";

type Avantage = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
};

type AvantageActionResponse = ServiceResult<Avantage | null>;

type AvantageCrudFormProps = {
  initialAvantage?: Avantage;
  onSubmitSuccess?: () => void;
};

const SubmitButton = ({ isEditMode }: { isEditMode: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? (isEditMode ? "Sauvegarde..." : "Création...") : (isEditMode ? "Sauvegarder" : "Créer")}
    </Button>
  );
};

export function AvantageCrudForm({ initialAvantage, onSubmitSuccess }: AvantageCrudFormProps) {
  const isEditMode = !!initialAvantage;

  const [title, setTitle] = useState(initialAvantage?.title || "");
  const [description, setDescription] = useState(initialAvantage?.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const formActionHandler = async (prevState: AvantageActionResponse, formData: FormData): Promise<AvantageActionResponse> => {
    formData.set("title", title);
    formData.set("description", description);
    if (imageFile) formData.set("image", imageFile);
    
    // Remplacer par votre action réelle
    return { ok: true, data: null };
  };

  const [state, formAction] = useFormState<AvantageActionResponse, FormData>(
    formActionHandler,
    { ok: true, data: initialAvantage || null }
  );

  useEffect(() => {
    if (state.ok) {
      toast.success(`Avantage ${isEditMode ? "mis à jour" : "créé"}`);
      onSubmitSuccess?.();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, isEditMode, onSubmitSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <Input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <Input type="file" name="image" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
      </div>
      <SubmitButton isEditMode={isEditMode} />
    </form>
  );
}
