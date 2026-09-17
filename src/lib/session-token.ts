import { createHmac, timingSafeEqual } from "node:crypto";

export function resolveDemoSecret(env: NodeJS.ProcessEnv = process.env): string {
  const fromEnv = env.DEMO_AUTH_SECRET;
  if (fromEnv && fromEnv.length >= 16) {
    return fromEnv;
  }
  if (env.NODE_ENV === "production") {
    throw new Error("DEMO_AUTH_SECRET must be set in production (min 16 characters).");
  }
  return "eastc-lms-local-demo-only";
}

export function signSessionToken(userId: string, secret: string): string {
  const signature = createHmac("sha256", secret).update(userId).digest("hex");
  return `${userId}.${signature}`;
}

export function verifySessionToken(token: string, secret: string): string | null {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) {
    return null;
  }
  const userId = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = createHmac("sha256", secret).update(userId).digest("hex");
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }
  return userId;
}
