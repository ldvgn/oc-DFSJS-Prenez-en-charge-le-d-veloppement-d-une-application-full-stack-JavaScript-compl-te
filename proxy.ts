import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/", "/login", "/register"];
const authRoutes = ["/login", "/register"];
const defaultAuthenticatedRoute = "/posts";

export const proxy = async (req: NextRequest) => {
  // Decodes the session cookie
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuthenticated = !!token;

  const { pathname } = req.nextUrl;
  if (publicRoutes.includes(pathname)) {
    // Skip login/register when already signed in.
    if (isAuthenticated && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL(defaultAuthenticatedRoute, req.url));
    }
    return NextResponse.next();
  }

  // Any non-public route requires a session.
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
};

// The proxy runs on every route except API routes, Next.js assets, and image files.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)",
  ],
};
