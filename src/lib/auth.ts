import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, type SessionUser } from "@/lib/roles";
import { resolveDemoSecret, signSessionToken, verifySessionToken } from "@/lib/session-token";

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const userId = verifySessionToken(token, resolveDemoSecret());
  if (!userId) {
    return null;
  }
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      campusTrack: true,
      bio: true,
    },
  });
}

export async function setSessionUser(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, signSessionToken(userId, resolveDemoSecret()), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
