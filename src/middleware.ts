import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const res = await updateSession(request);

  // After updating the session, check the path
  const { pathname } = request.nextUrl;

  // If we're at the root, we've already handled it in page.tsx
  if (pathname === "/") {
    return res;
  }

  // Get the session from the response
  const sessionStr = res.headers.get("x-session");
  const hasSession = sessionStr && JSON.parse(sessionStr).session !== null;

  // If user is logged in and trying to access auth routes, redirect to /home
  if (hasSession && (pathname.startsWith("/auth/") || pathname === "/")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
