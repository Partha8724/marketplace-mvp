import { BadgeCheck, CalendarClock, MailCheck, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelative } from "@/lib/utils";

export function SellerCard({
  seller,
}: {
  seller: {
    name: string | null;
    emailVerified: Date | null;
    createdAt: Date;
    profile: {
      city: string | null;
      ratingAverage: unknown;
      ratingCount: number;
      identityVerified: boolean;
      phoneVerified: boolean;
    } | null;
  };
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Seller</div>
          <h3 className="mt-2 text-2xl font-semibold text-stone-950">{seller.name || "Marketplace member"}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {seller.emailVerified ? <Badge variant="success"><MailCheck className="mr-1 h-3.5 w-3.5" />Verified email</Badge> : null}
          {seller.profile?.identityVerified ? <Badge variant="accent"><BadgeCheck className="mr-1 h-3.5 w-3.5" />Identity ready</Badge> : null}
        </div>
        <div className="space-y-3 text-sm text-stone-600">
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{seller.profile?.city || "Location shared on request"}</div>
          <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4" />Member {formatRelative(seller.createdAt)}</div>
          <div>Seller rating structure: {seller.profile?.ratingCount || 0} ratings</div>
        </div>
      </CardContent>
    </Card>
  );
}
