import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Container className="grid place-items-center py-16">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6 p-8">
          <div>
            <div className="text-sm text-stone-500">Welcome back</div>
            <h1 className="text-4xl font-semibold text-stone-950">Sign in to your account</h1>
          </div>
          <LoginForm />
          <Link
            href="/api/auth/signin/google"
            className="block rounded-full border border-stone-200 px-5 py-3 text-center text-sm font-semibold text-stone-900"
          >
            Continue with Google
          </Link>
          <p className="text-sm text-stone-600">
            New here? <Link href="/register" className="font-semibold text-stone-950">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
