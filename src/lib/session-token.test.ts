import { describe, expect, it } from "vitest";
import {
  resolveDemoSecret,
  signSessionToken,
  verifySessionToken,
} from "@/lib/session-token";

describe("demo session tokens", () => {
  const secret = "abcdefghijklmnopqrstuvwxyz";

  it("round-trips a signed user id", () => {
    const token = signSessionToken("user_123", secret);
    expect(verifySessionToken(token, secret)).toBe("user_123");
  });

  it("rejects a tampered token", () => {
    const token = signSessionToken("user_123", secret);
    expect(verifySessionToken(token.replace("user_123", "user_999"), secret)).toBeNull();
    expect(verifySessionToken("not-a-token", secret)).toBeNull();
  });

  it("requires DEMO_AUTH_SECRET in production", () => {
    expect(() => resolveDemoSecret({ NODE_ENV: "production" })).toThrow(/DEMO_AUTH_SECRET/);
    expect(resolveDemoSecret({ NODE_ENV: "development" })).toBe("eastc-lms-local-demo-only");
  });
});
