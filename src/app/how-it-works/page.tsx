import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  "Create an account and complete your profile.",
  "Upload item photos, describe the condition clearly, and submit the listing.",
  "Your listing goes through moderation before becoming public.",
  "Buyers can save items, message sellers, and report suspicious activity.",
];

export default function HowItWorksPage() {
  return (
    <Container className="space-y-8 py-10">
      <div>
        <div className="text-sm text-stone-500">Platform guide</div>
        <h1 className="text-4xl font-semibold text-stone-950">How Northstar Market works</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {steps.map((step, index) => (
          <Card key={step}>
            <CardContent className="p-6">
              <div className="text-sm text-stone-400">Step {index + 1}</div>
              <p className="mt-3 text-lg text-stone-700">{step}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
