import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const APP_URL = process.env.APP_URL ?? "https://stageplots.app";

export async function POST() {
  try {
    const priceId = process.env.STRIPE_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: 900,
                product_data: {
                  name: "StagePlot Pro Pass",
                  description: "Unlimited cloud saves and unwatermarked PDF exports.",
                },
              },
            },
          ],
      success_url: `${APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("checkout error", err);
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 }
    );
  }
}