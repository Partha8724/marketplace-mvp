import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { conditionLabels } from "@/lib/constants";
import { formatCurrency, formatRelative } from "@/lib/utils";

type ListingCardProps = {
  listing: {
    id: string;
    slug: string;
    title: string;
    city: string;
    createdAt: Date;
    price: unknown;
    status: string;
    condition: keyof typeof conditionLabels;
    category: { name: string };
    images: { url: string; alt: string | null }[];
    _count?: { favorites: number };
    user?: {
      name: string | null;
      profile?: { phoneVerified: boolean; identityVerified: boolean } | null;
    };
  };
};

export function ListingCard({ listing }: ListingCardProps) {
  const image = listing.images[0]?.url || "/window.svg";

  return (
    <Link href={`/listing/${listing.slug}`} className="group block">
      <Card className="overflow-hidden border-stone-200/80 transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          <Image
            src={image}
            alt={listing.images[0]?.alt || listing.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge variant={listing.status === "SOLD" ? "warning" : "success"}>{listing.status === "SOLD" ? "Sold" : "Live"}</Badge>
            <Badge>{conditionLabels[listing.condition]}</Badge>
          </div>
          <div className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-stone-700">
            <Heart className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">{listing.category.name}</div>
          <div className="line-clamp-2 text-lg font-semibold text-stone-950">{listing.title}</div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-xl font-semibold text-stone-950">{formatCurrency(String(listing.price))}</div>
            <div className="text-xs text-stone-500">{formatRelative(listing.createdAt)}</div>
          </div>
          <div className="flex items-center justify-between text-sm text-stone-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {listing.city}
            </div>
            <div>{listing._count?.favorites ?? 0} saves</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
