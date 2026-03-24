import { ProfileForm } from "@/components/forms/profile-form";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/permissions";

export default async function DashboardProfilePage() {
  const user = await requireUser();

  return (
    <Container className="py-10">
      <Card className="mx-auto max-w-3xl">
        <CardContent className="space-y-6 p-8">
          <div>
            <div className="text-sm text-stone-500">Seller profile</div>
            <h1 className="text-4xl font-semibold text-stone-950">Edit profile</h1>
          </div>
          <ProfileForm
            defaultValues={{
              name: user.name || "",
              city: user.profile?.city || "",
              bio: user.profile?.bio || "",
              phone: user.profile?.phone || "",
              photoUrl: user.profile?.photoUrl || "",
            }}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
