import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <div>
          <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
          <p className="mt-2 max-w-xl text-sm text-stone-600">{description}</p>
        </div>
        {ctaHref && ctaLabel ? (
          <Button asChild variant="secondary">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
