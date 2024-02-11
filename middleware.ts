import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

// NextAuthの設定を使用してauth関数を取得
const { auth } = NextAuth(authConfig);

//  ミドルウェア関数をエクスポート（リクエストに基づいて認証状態をチェック）
export default auth((req) => {
  //  リクエストからnextUrlを取得
  const { nextUrl } = req;
  //  ユーザーがログインしているかどうかを確認
  const isLoggedIn = !!req.auth;

  // API認証ルートかどうかを判断
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  //  公開ルートかどうかを判断
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  // 認証ルートかどうかを判断
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // API認証ルートの場合は何も返さない
  if (isApiAuthRoute) {
    return null;
  }

  // 認証ルートの場合
  if (isAuthRoute) {
    //  ユーザーがログインしている場合はデフォルトのログインリダイレクト先へリダイレクト
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    //  それ以外の場合は何も返さない
    return null
  }

  //  ユーザーがログインしておらず、公開ルートでない場合
  if (!isLoggedIn && !isPublicRoute) {
    //  コールバックURLを作成
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    //  コールバックURLをエンコード
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    //  ログインページへリダイレクト（コールバックURLを付与）
    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  //  それ以外の場合は何も返さない
  return null;
})

//  ミドルウェアを特定のパスで無効化する設定
export const config = {
  //  マッチャーパターンを指定
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
