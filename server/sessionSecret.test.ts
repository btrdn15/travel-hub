import assert from "node:assert/strict";
import test from "node:test";
import { getSessionSecret } from "./sessionSecret";

test("getSessionSecret returns configured private secret", () => {
  assert.equal(
    getSessionSecret({
      NODE_ENV: "production",
      SESSION_SECRET: "a-private-production-session-secret",
    }),
    "a-private-production-session-secret",
  );
});

test("getSessionSecret rejects missing production secret", () => {
  assert.throws(
    () => getSessionSecret({ NODE_ENV: "production" }),
    /SESSION_SECRET must be set/,
  );
});

test("getSessionSecret rejects known unsafe production secrets", () => {
  assert.throws(
    () =>
      getSessionSecret({
        NODE_ENV: "production",
        SESSION_SECRET: "travel-secret-key",
      }),
    /SESSION_SECRET must be set/,
  );
  assert.throws(
    () =>
      getSessionSecret({
        NODE_ENV: "production",
        SESSION_SECRET: "my_secret_key_12345",
      }),
    /SESSION_SECRET must be set/,
  );
});

test("getSessionSecret allows development fallback only outside production", () => {
  assert.equal(
    getSessionSecret({ NODE_ENV: "development" }),
    "dev-session-secret-do-not-use-in-production",
  );
});
