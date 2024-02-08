/**
 * 一般にアクセス可能なルートの配列。
 * これらのルートは認証を必要としない
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verification",
]


/**
 * 認証に使用されるルートの配列
 * これらのルートはログインユーザーを /settings にリダイレクトします。
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
]

/**
 * API 認証ルートのプレフィックス
 * このプレフィックスで始まるルートはAPI認証に使用されます。
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth"


/**
 * ログイン後のデフォルトのリダイレクトパス
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";