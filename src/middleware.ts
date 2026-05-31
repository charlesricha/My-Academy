import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes
  const protectedRoutes = ["/dashboard", "/timetable", "/curriculum", "/assignments", "/progress", "/resources"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Note: Client-side auth check is often enough for single-user apps with Firestore rules,
  // but we can add a simple cookie-based check here if we wanted to be more strict.
  // For now, we'll rely on the AuthProvider's redirect and Firestore rules.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/timetable/:path*",
    "/curriculum/:path*",
    "/assignments/:path*",
    "/progress/:path*",
    "/resources/:path*",
  ],
};
