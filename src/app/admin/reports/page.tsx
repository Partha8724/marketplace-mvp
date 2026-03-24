import { Container } from "@/components/layout/container";
import { ReportActions } from "@/components/admin/moderation-actions";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/permissions";

export default async function AdminReportsPage() {
  await requireAdmin();
  const reports = await prisma.report.findMany({
    include: { listing: true, reporter: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Container className="space-y-6 py-10">
      <h1 className="text-4xl font-semibold text-stone-950">Reports</h1>
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-lg font-semibold text-stone-950">{report.reason}</div>
                <div className="mt-1 text-sm text-stone-500">{report.reporter.email} • {report.listing?.title || "Listing removed"} • {report.status}</div>
              </div>
              <ReportActions reportId={report.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
