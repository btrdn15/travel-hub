import { storage } from "./storage";
import { seedDevelopmentAdmins } from "./adminBootstrap";

export async function seedDatabase() {
  await seedDevelopmentAdmins(storage);
}
