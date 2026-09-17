"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { clearSession, setSessionUser } from "@/lib/auth";

export async function signInAsDemoUser(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  if (!userId) {
    throw new Error("Choose a demo persona to continue.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("Unknown demo persona.");
  }
  await setSessionUser(user.id);
  revalidatePath("/", "layout");
  redirect(user.role === "EDUCATOR" ? "/studio" : "/dashboard");
}

export async function signOutDemoUser() {
  await clearSession();
  revalidatePath("/", "layout");
  redirect("/");
}
