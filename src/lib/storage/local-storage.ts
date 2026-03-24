import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadDir = process.env.UPLOAD_DIR || "public/uploads/listings";

export async function persistFiles(files: File[]) {
  await mkdir(uploadDir, { recursive: true });

  const saved: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const ext = file.name.split(".").pop() || "bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const destination = path.join(uploadDir, fileName);

    await writeFile(destination, Buffer.from(arrayBuffer));
    saved.push(`/uploads/listings/${fileName}`);
  }

  return saved;
}
