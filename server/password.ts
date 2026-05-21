import { scrypt, timingSafeEqual, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(
  supplied: string,
  stored: string,
): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false;
  }

  const hashedBuffer = Buffer.from(hashed, "hex");
  if (hashedBuffer.length !== 64) {
    return false;
  }

  const suppliedBuffer = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuffer, suppliedBuffer);
}
