"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";

import { toggleFavoriteAction } from "@/actions/listing-actions";
import { Button } from "@/components/ui/button";

export function FavoriteButton({ listingId, initialSaved }: { listingId: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await toggleFavoriteAction(listingId);
          if (result.success) setSaved((current) => !current);
        })
      }
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
