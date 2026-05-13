import { storage } from "./storage";
import { ensureBootstrapSuperAdmin } from "./bootstrapAdmin";

export async function seedDatabase() {
  await ensureBootstrapSuperAdmin({ storage });
}
