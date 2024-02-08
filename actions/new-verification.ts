"use server"

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
    //  トークンを使用して既存のトークンをデータベースから取得します。
    const existingToken = await getVerificationTokenByToken(token);
   
    //  トークンが存在しない場合、エラーメッセージを返します。
    if (!existingToken) {
      return { error: "トークンが見つかりません" };
    }
   
    //  トークンが期限切れかどうかをチェックします。
    const hasExpired = new Date(existingToken.expires) < new Date();
   
    //  トークンが期限切れの場合、エラーメッセージを返します。
    if (hasExpired) {
      return { error: "トークンが期限切れです" };
    }
   
    //  トークンに関連付けられたメールアドレスを使用してユーザーをデータベースから取得します。
    const existingUser = await getUserByEmail(existingToken.email);
   
    //  ユーザーが存在しない場合、エラーメッセージを返します。
    if (!existingUser) {
      return { error: "メールアドレスが見つかりません" };
    }
   
    //  ユーザーのメールアドレスを確認し、ユーザーのデータベースレコードを更新します。
    await db.user.update({
      where: { id: existingUser.id }, //  ユーザーIDに基づいて特定のユーザーを更新します。
      data: {  
        emailVerified: new Date(), //  メールアドレスの確認日時を現在の日時に設定します。
        email: existingToken.email, //  トークンに関連付けられたメールアドレスを保持します。
      }
    });
   
    //  トークンをデータベースから削除します。
    await db.verificationToken.delete({
      where: { id: existingToken.id } //  トークンIDに基づいて特定のトークンを削除します。
    });
   
    //  メールアドレスの確認が成功したことを示すメッセージを返します。
    return { success: "Eメールが確認されました" };
};
