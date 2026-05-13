const INSECURE_SESSION_SECRETS = new Set([
  "travel-secret-key",
  "my_secret_key_12345",
]);

export function getSessionSecret(env: Record<string, string | undefined> = process.env) {
  const secret = env.SESSION_SECRET;

  if (secret && !(env.NODE_ENV === "production" && INSECURE_SESSION_SECRETS.has(secret))) {
    return secret;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to a private value in production.");
  }

  return "dev-session-secret-do-not-use-in-production";
}
