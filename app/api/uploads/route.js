import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { hasAdminWriteAccess } from "../../../lib/adminAccess";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const maxFileSize = 5 * 1024 * 1024;
const uploadDir = path.join(process.cwd(), "public", "uploads");
const allowedTypes = {
  "image/jpeg": "jpg",
  "image/png": "png"
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const pin = formData.get("pin");

    if (!hasAdminWriteAccess(request, pin)) {
      return NextResponse.json({ error: "Admin PIN required." }, { status: 401 });
    }

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ error: "Choose a JPG or PNG image." }, { status: 400 });
    }

    const extension = allowedTypes[file.type];

    if (!extension) {
      return NextResponse.json({ error: "Only JPG and PNG images are supported." }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}.${extension}`;

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      name: file.name,
      size: file.size,
      type: file.type
    });
  } catch {
    return NextResponse.json({ error: "Could not upload that image." }, { status: 400 });
  }
}
