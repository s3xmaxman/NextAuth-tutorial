"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"
import { NewPasswordSchema } from "@/schemas" 
import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"


export const newPassword = async (  
    value: z.infer<typeof NewPasswordSchema>,  
    token?: string | null  
) => {

   //  トークンが提供されていない場合、エラーメッセージを返す
   if(!token) {
      return { error: "トークンがありません" }
   }
   
   //  パスワードリセットスキーマを使用して入力値を検証する
   const validatedFields = NewPasswordSchema.safeParse(value)

   // 検証が失敗した場合、エラーメッセージを返す
   if (!validatedFields.success) {
      return { error: "無効なトークンです" }
   }

   // 検証されたフィールドからパスワードを取得する
   const { password } = validatedFields.data
   
   //  トークンを使用してデータベースからパスワードリセットトークンを取得する
   const existingToken = await getPasswordResetTokenByToken(token)

   //  トークンが存在しない場合、エラーメッセージを返す
   if(!existingToken) {
      return { error: "無効なトークンです" }
   }
   
   //  トークンが期限切れかどうかをチェックする
   const hasExpired = new Date(existingToken.expires) < new Date();

   //  トークンが期限切れの場合、エラーメッセージを返す
   if (hasExpired) {
      return { error: "トークンが期限切れです" }
   }

   //  トークンに関連付けられたメールアドレスを使用してユーザーをデータベースから取得する
   const existingUser = await getUserByEmail(existingToken.email)

   //  ユーザーが存在しない場合、エラーメッセージを返す
   if(!existingUser) {
      return { error: "メールアドレスが見つかりません" }
   }
   
   //  パスワードをハッシュ化する
   const hashedPassword = await bcrypt.hash(password,  10)
   
   //  ユーザーのパスワードを更新する
   await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword }
   })

   //  トークンを使用してデータベースからパスワードリセットトークンを削除する
   await db.passwordResetToken.delete({
      where: { id: existingToken.id }
   })

   //  パスワード変更が成功したことを示すメッセージを返す
   return { success: "パスワードを変更しました" }
}
