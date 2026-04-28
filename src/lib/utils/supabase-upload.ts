export async function uploadFileToSupabase(supabase: any, bucketName: string, file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);

  if (uploadError) {
    console.error('Supabase Upload Error:', uploadError);
    return { ok: false, error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  const url = publicUrlData.publicUrl;

  return { ok: true, data: { url, filePath } };
}