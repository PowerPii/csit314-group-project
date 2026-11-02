import { getDb } from "@/lib/supabase";

// Uploads a file to a public Supabase Storage bucket and returns its public URL.
// Used only by entity classes (CompanyProfile logos, Project images).
export async function uploadPublicFile(bucket: string, folder: string, file: File): Promise<string> {
  const storage = getDb().storage;
  const { data: existing } = await storage.getBucket(bucket);
  if (!existing) {
    const { error } = await storage.createBucket(bucket, { public: true });
    if (error && !/already exists/i.test(error.message)) {
      throw new Error(`Creating bucket ${bucket} failed: ${error.message}`);
    }
  }

  const extension = file.type === "image/png" ? "png" : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await storage.from(bucket).upload(path, file, { contentType: file.type });
  if (error) throw new Error(`Uploading to ${bucket} failed: ${error.message}`);
  return storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
