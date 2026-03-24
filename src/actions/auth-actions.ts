"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { failureState, successState, type ActionState } from "@/lib/action-state";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validations";

export async function registerAction(input: unknown): Promise<ActionState> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return failureState("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (existing) {
    return failureState("An account with that email already exists.", {
      email: ["Use a different email address."],
    });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      profile: {
        create: {
          city: parsed.data.city,
          phoneVerified: false,
          identityVerified: false,
        },
      },
    },
  });

  await signIn("credentials", {
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
    redirect: false,
  });

  return successState("Account created.", "/dashboard");
}

export async function credentialLoginAction(input: { email: string; password: string }): Promise<ActionState> {
  try {
    await signIn("credentials", { ...input, redirect: false });
    return successState("Signed in.", "/dashboard");
  } catch {
    return failureState("Incorrect email or password.");
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
  redirect("/");
}
