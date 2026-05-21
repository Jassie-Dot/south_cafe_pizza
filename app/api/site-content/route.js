import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  cleanSiteContent,
  contentCapabilities,
  defaultSiteContent
} from "../../../lib/siteContentSchema";
import {
  hasAdminWriteAccess,
  requestRequiresAdminPin
} from "../../../lib/adminAccess";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const contentPath = path.join(process.cwd(), "data", "site-content.json");

async function readStoredContent() {
  try {
    const raw = await readFile(contentPath, "utf8");
    return cleanSiteContent(JSON.parse(raw));
  } catch {
    return cleanSiteContent(defaultSiteContent);
  }
}

export async function GET(request) {
  const content = await readStoredContent();

  return NextResponse.json(
    {
      content,
      defaults: cleanSiteContent(defaultSiteContent),
      capabilities: contentCapabilities(),
      requiresPin: requestRequiresAdminPin(request)
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  if (!hasAdminWriteAccess(request, body)) {
    return NextResponse.json(
      { error: "Admin PIN required. Set ADMIN_PIN in the environment for production editing." },
      { status: 401 }
    );
  }

  const content = cleanSiteContent(body.content);
  await mkdir(path.dirname(contentPath), { recursive: true });
  await writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");

  return NextResponse.json({ content, saved: true });
}
