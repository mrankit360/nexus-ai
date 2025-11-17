import { aj } from "@/config/Arcjet";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  const user = await currentUser();

  let body = {};
  try {
    body = await req.json();
  } catch (err) {
    // If no body, default to empty object
    body = {};
  }

  const token = body.token || 0; // default 0 if not provided

  const decision = await aj.protect(req, {
    userId: user?.primaryEmailAddress?.emailAddress,
    requested: token,
  });

  console.log("Arcjet remaining tokens:", decision.reason.remaining);

  if (decision.isDenied()) {
    return NextResponse.json({
      error: "Too Many Requests",
      remainingToken: decision.reason.remaining,
    });
  }

  return NextResponse.json({
    allowed: true,
    remainingToken: decision.reason.remaining,
  });
}
