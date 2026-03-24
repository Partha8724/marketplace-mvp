import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { persistFiles } from "@/lib/storage/local-storage";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const urls = await persistFiles(files);

  return NextResponse.json({ urls });
}
