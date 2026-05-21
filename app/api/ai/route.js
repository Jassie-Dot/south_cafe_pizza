import { NextResponse } from "next/server";
import { contact, hours, menuItems, ordering, specials } from "../../../lib/siteData";
import {
  extractGeminiText,
  generateGeminiContent,
  hasGeminiApiKey
} from "../../../lib/geminiApi";

const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 900;

function cleanText(value) {
  return typeof value === "string" ? value.trim().slice(0, MAX_MESSAGE_LENGTH) : "";
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => {
      const text = cleanText(message?.text);
      const role = message?.role === "assistant" ? "assistant" : "user";
      return text ? { role, content: text } : null;
    })
    .filter(Boolean);
}

function restaurantContext() {
  const menu = menuItems.map((item) => ({
    name: item.name,
    category: item.category,
    price: item.price,
    options: item.options?.map((option) => `${option.label}: $${option.price}`),
    badge: item.badge,
    description: item.description,
    orderable: item.orderable !== false && item.priceValue !== null
  }));

  return JSON.stringify(
    {
      restaurant: contact.name,
      address: contact.address,
      phone: contact.phoneDisplay,
      email: contact.email,
      ordering: {
        deliveryFee: `$${ordering.deliveryFee}`,
        deliveryMinimumBeforeTax: `$${ordering.minimumDeliverySubtotal}`,
        pickupTimes: ordering.pickupTimes
      },
      hours,
      specials,
      menu
    },
    null,
    2
  );
}

export async function POST(request) {
  try {
    if (!hasGeminiApiKey()) {
      return NextResponse.json(
        {
          error:
            "Gemini is not configured yet. Add GEMINI_API_KEY to your environment and restart the server."
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const messages = normalizeMessages(body?.messages);

    if (!messages.length) {
      return NextResponse.json({ error: "Send at least one message." }, { status: 400 });
    }

    const data = await generateGeminiContent({
      systemInstruction: `You are South Pizza's website assistant. Be warm, concise, and practical. Help guests choose menu items, understand prices, hours, location, pickup, delivery minimums, and how to confirm orders. Do not invent prices, policies, or availability beyond the context. If a guest wants to place or change an order, guide them to use the website cart or call ${contact.phoneDisplay}. Restaurant context:\n${restaurantContext()}`,
      contents: messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }]
      })),
      temperature: 0.55,
      maxOutputTokens: 420
    });

    const reply =
      extractGeminiText(data) ||
      "I am here to help with the South Pizza menu, hours, pickup, and delivery details.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "The AI assistant could not read that request." },
      { status: 400 }
    );
  }
}
