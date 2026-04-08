import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Protect API routes (except auth endpoints)
  if (request.nextUrl.pathname.startsWith("/api") && 
      !request.nextUrl.pathname.startsWith("/api/auth") &&
      !request.nextUrl.pathname.startsWith("/api/public")) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
