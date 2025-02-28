import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";  // `auth.ts` で `auth()` をエクスポートしていると仮定


export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  console.log("Middleware: checking session");
  console.log(session?.user);

  if (!session?.user) {
    return NextResponse.redirect(new URL("/user/login", request.url));
  }

  if (session.user.isAdmin) {
    if (!pathname.startsWith("/owner")) {
      return NextResponse.redirect(new URL("/owner", request.url));
    }
  } else {
    if (!pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  return NextResponse.next();
}
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher:  ['/((?!user/login|register|api|_next/static|_next/image|admin/login|.*\\.png$).*)'],
  runtime: 'nodejs',
};
