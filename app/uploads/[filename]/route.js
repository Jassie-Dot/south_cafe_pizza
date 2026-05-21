import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const allowedFilenamePattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(jpe?g|png)$/i;
const contentTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png"
};

export async function GET(_request, { params }) {
  const { filename } = await params;

  if (!allowedFilenamePattern.test(filename) || path.basename(filename) !== filename) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  try {
    const extension = path.extname(filename).toLowerCase();
    const file = await readFile(path.join(uploadsDir, filename));

    return new NextResponse(file, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": contentTypes[extension] || "application/octet-stream"
      }
    });
  } catch {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}
