"use client";

import { useTransition } from "react";

import { signOutAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button variant="secondary" disabled={pending} onClick={() => startTransition(async () => signOutAction())}>
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
