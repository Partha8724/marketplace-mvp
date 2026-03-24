import Link from "next/link";

import { RegisterForm } from "@/components/forms/register-form";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Container className="grid place-items-center py-16">
      <Card className="w-full max-w-xl">
        <CardContent className="space-y-6 p-8">
          <div>
            <div className="text-sm text-stone-500">Create your seller profile</div>
            <h1 className="text-4xl font-semibold text-stone-950">Join Northstar Market</h1>
          </div>
          <RegisterForm />
          <p className="text-sm text-stone-600">
            Already have an account? <Link href="/login" className="font-semibold text-stone-950">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
