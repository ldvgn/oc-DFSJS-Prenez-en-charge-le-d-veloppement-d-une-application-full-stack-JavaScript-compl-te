import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/auth";

const publicRoutes = ["/", "/login", "/register"];
const authRoutes = ["/", "/login", "/register"];
const defaultAuthenticatedRoute = "/posts";

export const proxy = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Redirect an already logged-in user to the default authenticated page when they visit an authentication route.
  if (authRoutes.includes(pathname)) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (session) {
      return NextResponse.redirect(new URL(defaultAuthenticatedRoute, req.url));
    }
    return NextResponse.next();
  }

  // Let public routes pass through without checking.
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to /login if no session cookie is present.
  if (!getSessionCookie(req)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
};

// Defines on which routes the middleware runs: all except /api, Next assets, and images.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)",
  ],
};
