import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { createClient } from "@/lib/server";

export async function POST(request: Request) {
  try {
    // Get the Supabase client
    const supabase = await createClient();

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emails, subject, content } = await request.json();

    if (!emails?.length || !subject || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send emails in parallel
    const sendPromises = emails.map(async (email: string) => {
      return resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: email,
        subject,
        html: content,
      });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
