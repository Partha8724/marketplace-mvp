import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminPage() {
  await requireAdmin();
  const [users, listings, reports] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.report.count({ where: { status: "OPEN" } }),
  ]);

  return (
    <Container className="space-y-6 py-10">
      <h1 className="text-4xl font-semibold text-stone-950">Admin dashboard</h1>
      <div className="grid gap-5 md:grid-cols-3">
        <Card><CardContent className="p-6"><div className="text-sm text-stone-500">Users</div><div className="mt-2 text-3xl font-semibold">{users}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-stone-500">Listings</div><div className="mt-2 text-3xl font-semibold">{listings}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm text-stone-500">Open reports</div><div className="mt-2 text-3xl font-semibold">{reports}</div></CardContent></Card>
      </div>
    </Container>
  );
}
