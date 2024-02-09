"use server"

import * as z from "zod"

import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";


export const Login = async(values: z.infer<typeof LoginSchema>) => {
    //  フォームの値をLoginSchemaでバリデーション
    const validatedFields = LoginSchema.safeParse(values)

    //  バリデーションに失敗した場合、エラ���メッセージを返す
    if (!validatedFields.success) {
        return { error:"パスワードまたはメールアドレスが無効です" }
    }
    
    //  バリデーションされたフィールドから必要な情報を取得
    const { email, password, code } = validatedFields.data

    //  メールアドレスでユーザーを検索
    const existingUser = await getUserByEmail(email)

    //  ユーザーが存在しない、またはメールアドレスやパスワードが不足している場合、エラーメッセージを返す
    if(!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "存在しないメールアドレスです" }
    }

    //  ユーザーのメールアドレスが未確認の場合、確認メールを送信
    if(!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return { success: "確認メールを送信しました" }
    }

    //  ユーザーが二要素認証を有効にしており、コードが提供されている場合
    if(existingUser.isTwoFactorEnabled && existingUser.email) {
        if(code) {
            //  二要素認証トークンを取得
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            if(!twoFactorToken) {
                return { error: "二要素認証トークンが無効です" }
            }

            //  提供されたコードとトークンが一致しない場合、エラーメッセージを返す
            if(twoFactorToken.token !== code) {
                return { error: "コードが間違っています" }
            }

            //  トークンが期限切れかどうかチェック
            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            //  トークンが期限切れの場合、エラーメッセージを返す
            if(hasExpired) {
                return { error: "二要素認証トークンが期限切れです" }
            }

            //  二要素認証トークンを削除
            await db.twoFactorToken.delete({ where: { id: twoFactorToken.id }})

            //  ユーザーの二要素認証確認を取得
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

            // 確認が存在する場合、それを削除
            if(existingConfirmation) {
                await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id }})
            }

            //  新しい二要素認証確認を作成
            await db.twoFactorConfirmation.create({ data: { userId: existingUser.id }})
        } else {
            //  二要素認証トークンを生成
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            //  二要素認証トークンをメールで送信
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
    
            //  二要素認証が必要であることを示すオブジェクトを返す
            return { twoFactor: true }
        }
      
    }
    
    // 資格情報によるサインインを試みる
    try {
        await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT})
    } catch (error) {
        // 認証エラーが発生した場合、適切なエラーメッセージを返す
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "無効な入力があります" }
                default:
                    return { error: "ログインに失敗しました" }    
            }
        }
        //  それ以外のエラーは再スロー
        throw error
    }   
}
