import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("session_id")?.trim();

  if (!id || !id.startsWith("cs_")) {
    return Response.json(
      { paid: false, error: "Missing or invalid session_id" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id);

    return Response.json({
      paid: session.payment_status === "paid",
      email: session.customer_details?.email ?? null,
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? null,
    });
  } catch (err) {
    console.error("verify error:", err);
    return Response.json(
      { paid: false, error: "Could not verify session" },
      { status: 400 }
    );
  }
}