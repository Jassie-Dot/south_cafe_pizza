import { NextResponse } from "next/server";

const MINIMUM_DELIVERY_SUBTOTAL = 18;

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
    const orderType = order.orderType === "delivery" ? "delivery" : "pickup";

    if (!items.length) {
      return NextResponse.json({ error: "Order must include at least one item." }, { status: 400 });
    }

    if (order.orderType && order.orderType !== "pickup" && order.orderType !== "delivery") {
      return NextResponse.json({ error: "Order type must be pickup or delivery." }, { status: 400 });
    }

    if (!isPresent(customer.name) || !isPresent(customer.phone)) {
      return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
    }

    if (orderType === "delivery" && !isPresent(customer.address)) {
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

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
      0
    );

    if (orderType === "delivery" && subtotal < MINIMUM_DELIVERY_SUBTOTAL) {
      return NextResponse.json(
        { error: "Delivery orders need at least $18.00 before tax." },
        { status: 400 }
      );
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
