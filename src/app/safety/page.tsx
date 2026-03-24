import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { safeMeetupTips } from "@/lib/constants";

export default function SafetyPage() {
  return (
    <Container className="space-y-8 py-10">
      <div>
        <div className="text-sm text-stone-500">Safety center</div>
        <h1 className="text-4xl font-semibold text-stone-950">Trade smarter and safer</h1>
      </div>
      <Card>
        <CardContent className="p-8">
          <ul className="space-y-4 text-stone-600">
            {safeMeetupTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}
