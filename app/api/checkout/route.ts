import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const APP_URL = process.env.APP_URL ?? "https://stageplots.app";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const priceId = body.priceId || process.env.STRIPE_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId ?? "price_1M...",
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
