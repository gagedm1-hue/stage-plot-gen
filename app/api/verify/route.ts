import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ paid: false }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ 
      paid: session.payment_status === "paid",
      customer_email: session.customer_details?.email 
    });
  } catch (err: any) {
    console.error("Verification error:", err);
    return NextResponse.json({ paid: false }, { status: 500 });
  }
}
