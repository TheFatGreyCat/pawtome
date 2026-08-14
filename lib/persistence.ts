import { createSupabaseBrowserClient } from "./supabase/browser.ts";

export const PET_PHOTO_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const PET_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export function validatePetPhoto(file: Pick<File, "type" | "size">): string | null {
  if (!PET_PHOTO_MIME_TYPES.includes(file.type as (typeof PET_PHOTO_MIME_TYPES)[number])) return "Use a JPEG, PNG, or WebP image.";
  if (file.size <= 0 || file.size > PET_PHOTO_MAX_BYTES) return "Image size must be between 1 byte and 5 MB.";
  return null;
}

export function safePetPhotoPath(userId: string, fileName: string, id = crypto.randomUUID()): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) throw new Error("Invalid user ID.");
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension || !["jpg", "jpeg", "png", "webp"].includes(extension)) throw new Error("Unsupported image extension.");
  return `${userId}/${id}.${extension === "jpeg" ? "jpg" : extension}`;
}

async function authenticatedClient() {
  const client = createSupabaseBrowserClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return { client, user: data.user };
}

export async function persistFavorite(targetType: string, targetKey: string, saved: boolean) {
  const auth = await authenticatedClient();
  if (!auth) return false;
  const query = auth.client.from("favorites");
  const result = saved
    ? await query.upsert({ user_id: auth.user.id, target_type: targetType, target_key: targetKey }, { onConflict: "user_id,target_type,target_key" })
    : await query.delete().eq("user_id", auth.user.id).eq("target_type", targetType).eq("target_key", targetKey);
  return !result.error;
}

export async function uploadPetPhoto(petId: string, file: File) {
  const validation = validatePetPhoto(file);
  if (validation) throw new Error(validation);
  const auth = await authenticatedClient();
  if (!auth) throw new Error("Sign in before uploading a private pet photo.");
  const storagePath = safePetPhotoPath(auth.user.id, file.name);
  const { error: uploadError } = await auth.client.storage.from("pet-photos").upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;
  const { error: rowError } = await auth.client.from("pet_photos").insert({ pet_id: petId, owner_id: auth.user.id, storage_path: storagePath, mime_type: file.type, file_size: file.size });
  if (rowError) {
    await auth.client.storage.from("pet-photos").remove([storagePath]);
    throw rowError;
  }
  return storagePath;
}

export async function persistCareTask(petId: string, title: string, completed: boolean) {
  const auth = await authenticatedClient();
  if (!auth) return false;
  const { error } = await auth.client.from("care_tasks").insert({ pet_id: petId, owner_id: auth.user.id, title: title.slice(0, 160), completed_at: completed ? new Date().toISOString() : null });
  return !error;
}

export async function persistWeightEntry(petId: string, weightKg: number) {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg >= 1000) return false;
  const auth = await authenticatedClient();
  if (!auth) return false;
  const { error } = await auth.client.from("weight_entries").insert({ pet_id: petId, owner_id: auth.user.id, weight_kg: weightKg });
  return !error;
}

export async function persistTrainingProgress(petId: string, trainingGuideId: string, completedSteps: number, successfulAttempts: number) {
  if (![completedSteps, successfulAttempts].every(value => Number.isInteger(value) && value >= 0)) return false;
  const auth = await authenticatedClient();
  if (!auth) return false;
  const { error } = await auth.client.from("training_progress").upsert({ pet_id: petId, owner_id: auth.user.id, training_guide_id: trainingGuideId, completed_steps: completedSteps, successful_attempts: successfulAttempts, last_practiced_at: new Date().toISOString() }, { onConflict: "pet_id,training_guide_id" });
  return !error;
}
