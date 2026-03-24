"use server";

import { revalidatePath } from "next/cache";

import { failureState, successState, type ActionState } from "@/lib/action-state";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";
import { profileSchema } from "@/lib/validations";

export async function updateProfileAction(input: unknown): Promise<ActionState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return failureState("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      profile: {
        upsert: {
          create: parsed.data,
          update: parsed.data,
        },
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return successState("Profile updated.");
}
