import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";  // `auth.ts` で `auth()` をエクスポートしていると仮定


export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  console.log("Middleware: checking session");
  console.log(session?.user);
  console.log("pathName", pathname);

  if (!session?.user) {
    return NextResponse.redirect(new URL("/user/login", request.url));
  }

    // ログイン済みでルート ("/") へのアクセスの場合、ユーザーの役割に応じたダッシュボードへリダイレクト
    // if (pathname === "/") {
    //   if (session.user.isAdmin) {
    //     return NextResponse.redirect(new URL("/owner", request.url));
    //   } else {
    //     return NextResponse.redirect(new URL("/user", request.url));
    //   }
    // }


  if (session.user.isAdmin) {
    // adminユーザはadmin階層配下以外に入れないように制御。
    if (!pathname.startsWith("/owner")) {
      return NextResponse.redirect(new URL("/owner", request.url));
    }
  } else {
    // 一般ユーザーはuser配下以外に入れないように制御。
    if (!pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  return NextResponse.next();
}
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher:  ['/((?!user/login|owner/login|register|api|_next/static|_next/image|.*\\.png$).*)'],
  runtime: 'nodejs',
};
