import { NextResponse } from "next/server";

function isPresent(value) {
  return typeof value === "string" && value.trim().length > 1;
}

function makeOrderId() {
  const datePart = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SP-${datePart}-${randomPart}`;
}

export async function POST(request) {
  try {
    const order = await request.json();
    const items = Array.isArray(order.items) ? order.items : [];
    const customer = order.customer || {};

    if (!items.length) {
      return NextResponse.json({ error: "Order must include at least one item." }, { status: 400 });
    }

    if (!isPresent(customer.name) || !isPresent(customer.phone)) {
      return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
    }

    if (order.orderType === "delivery" && !isPresent(customer.address)) {
      return NextResponse.json({ error: "Delivery address is required." }, { status: 400 });
    }

    const invalidItem = items.find(
      (item) =>
        !isPresent(item.name) ||
        !Number.isFinite(Number(item.unitPrice)) ||
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) < 1
    );

    if (invalidItem) {
      return NextResponse.json({ error: "One or more order items are invalid." }, { status: 400 });
    }

    return NextResponse.json(
      {
        ok: true,
        orderId: makeOrderId(),
        nextStep: "Call South Pizza to confirm timing and payment."
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json({ error: "Unable to read order request." }, { status: 400 });
  }
}
