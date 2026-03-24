import { Container } from "@/components/layout/container";
import { UserBlockButton } from "@/components/admin/moderation-actions";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { profile: true },
  });

  return (
    <Container className="space-y-6 py-10">
      <h1 className="text-4xl font-semibold text-stone-950">Users</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-lg font-semibold text-stone-950">{user.name || user.email}</div>
                <div className="mt-1 text-sm text-stone-500">{user.email} • {user.role} • {user.profile?.city || "No city"}</div>
              </div>
              <UserBlockButton userId={user.id} isBlocked={user.isBlocked} />
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
