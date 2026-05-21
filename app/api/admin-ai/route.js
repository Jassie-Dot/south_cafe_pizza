import { NextResponse } from "next/server";
import {
  cleanSiteContent,
  contentCapabilities,
  defaultSiteContent
} from "../../../lib/siteContentSchema";
import { hasAdminWriteAccess } from "../../../lib/adminAccess";
import {
  extractGeminiText,
  generateGeminiContent,
  hasGeminiApiKey
} from "../../../lib/geminiApi";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const adminAiResponseSchema = {
  type: "object",
  properties: {
    content: {
      type: "object",
      properties: {
        topDeals: {
          type: "array",
          items: {
            type: "object",
            properties: {
              eyebrow: { type: "string" },
              title: { type: "string" },
              price: { type: "string" },
              description: { type: "string" },
              image: { type: "string" }
            },
            required: ["eyebrow", "title", "price", "description", "image"]
          }
        },
        specials: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              price: { type: "string" },
              description: { type: "string" },
              tag: { type: "string" }
            },
            required: ["title", "price", "description", "tag"]
          }
        },
        galleryImages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              src: { type: "string" },
              alt: { type: "string" },
              title: { type: "string" }
            },
            required: ["src", "alt", "title"]
          }
        },
        layout: {
          type: "object",
          properties: {
            defaultTheme: { type: "string", enum: ["system", "light", "dark"] },
            heroMode: { type: "string", enum: ["slideshow", "static"] },
            heroTextAlign: { type: "string", enum: ["left", "center"] },
            heroOverlay: { type: "string", enum: ["soft", "strong"] },
            menuDensity: { type: "string", enum: ["compact", "standard"] },
            sectionSpacing: { type: "string", enum: ["compact", "comfortable"] },
            showDough: { type: "boolean" },
            showSpecials: { type: "boolean" },
            showGallery: { type: "boolean" },
            showVisit: { type: "boolean" },
            showMax: { type: "boolean" },
            showFloatingOrder: { type: "boolean" }
          },
          required: [
            "defaultTheme",
            "heroMode",
            "heroTextAlign",
            "heroOverlay",
            "menuDensity",
            "sectionSpacing",
            "showDough",
            "showSpecials",
            "showGallery",
            "showVisit",
            "showMax",
            "showFloatingOrder"
          ]
        }
      },
      required: ["topDeals", "specials", "galleryImages", "layout"]
    },
    summary: { type: "string" },
    checks: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["content", "summary", "checks"]
};

function text(value) {
  return typeof value === "string" ? value.trim().slice(0, 1600) : "";
}

function extractJson(value) {
  const raw = text(value);
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

function fallbackImprove(content, instruction) {
  const lower = instruction.toLowerCase();
  const next = cleanSiteContent(content || defaultSiteContent);

  next.layout = {
    ...next.layout,
    showMax: true,
    showFloatingOrder: true,
    heroOverlay: "strong",
    sectionSpacing: lower.includes("compact") ? "compact" : "comfortable",
    menuDensity: lower.includes("compact") ? "compact" : next.layout.menuDensity
  };

  if (lower.includes("hide dough")) next.layout.showDough = false;
  if (lower.includes("show dough")) next.layout.showDough = true;
  if (lower.includes("hide gallery")) next.layout.showGallery = false;
  if (lower.includes("show gallery")) next.layout.showGallery = true;
  if (lower.includes("hide specials")) next.layout.showSpecials = false;
  if (lower.includes("show specials")) next.layout.showSpecials = true;
  if (lower.includes("center hero")) next.layout.heroTextAlign = "center";
  if (lower.includes("left hero")) next.layout.heroTextAlign = "left";
  if (lower.includes("dark")) next.layout.defaultTheme = "dark";
  if (lower.includes("light")) next.layout.defaultTheme = "light";

  return {
    content: next,
    summary:
      "AI fallback cleaned the current content and adjusted layout settings from your instruction.",
    checks: [
      "JPG/PNG uploads stay local when added through the image controls.",
      "Empty or invalid editable values are replaced with safe defaults.",
      "Layout changes stay inside approved website controls."
    ]
  };
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!hasAdminWriteAccess(request, body)) {
      return NextResponse.json({ error: "Admin PIN required." }, { status: 401 });
    }

    const instruction = text(body.instruction);

    if (!instruction) {
      return NextResponse.json({ error: "Tell the AI what to change." }, { status: 400 });
    }

    const currentContent = cleanSiteContent(body.content || defaultSiteContent);

    if (!hasGeminiApiKey()) {
      return NextResponse.json(fallbackImprove(currentContent, instruction));
    }

    let data;

    try {
      data = await generateGeminiContent({
        systemInstruction:
          "You are the South Pizza admin AI. You may only edit the provided JSON website content: hot deals, specials, gallery items, and layout settings. Do not invent server abilities, code changes, credentials, or hidden tools. Return JSON only with keys: content, summary, checks. The content must preserve this shape and use only the allowed capabilities.",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: JSON.stringify(
                  {
                    instruction,
                    capabilities: contentCapabilities(),
                    currentContent
                  },
                  null,
                  2
                )
              }
            ]
          }
        ],
        temperature: 0.25,
        maxOutputTokens: 2200,
        responseMimeType: "application/json",
        responseJsonSchema: adminAiResponseSchema
      });
    } catch {
      return NextResponse.json(fallbackImprove(currentContent, instruction));
    }

    const parsed = extractJson(extractGeminiText(data));

    if (!parsed?.content) {
      return NextResponse.json(fallbackImprove(currentContent, instruction));
    }

    return NextResponse.json({
      content: cleanSiteContent({ ...currentContent, ...parsed.content }),
      summary: text(parsed.summary) || "AI updated the editable website draft.",
      checks: Array.isArray(parsed.checks)
        ? parsed.checks.slice(0, 6).map((item) => text(item)).filter(Boolean)
        : ["Editable content was cleaned before being applied."]
    });
  } catch {
    return NextResponse.json(
      { error: "The admin AI could not process that request." },
      { status: 400 }
    );
  }
}
