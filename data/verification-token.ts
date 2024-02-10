import { db } from "@/lib/db"


export const getVerificationTokenByEmail = async (email: string) => {
    //  メールアドレスに基づいて最初の認証トークンを検索します。
    try {
        //  データベースから該当する認証トークンを取得します。
        const verificationToken = await db.verificationToken.findFirst({ where: { email } })
        // 認証トークンが見つかった場合はそれを返します。
        return verificationToken
    } catch (error) {
        //  エラーが発生した場合はnullを返します。
        return null
    }
}


export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await db.verificationToken.findUnique({ where: { token } })
        return verificationToken
    } catch (error) {
        return null
    }
}
