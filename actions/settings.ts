"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

// import { update } from "@/auth";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "ログインしてください" };
    }

    const dbUser = await getUserById(user.id!);

    if (!dbUser) {
        return { error: "ユーザー情報の取得に失敗しました" };
    }

    if(user.isOAuth) {
       values.email = undefined
       values.password = undefined
       values.newPassword = undefined
       values.isTwoFactorEnabled = undefined
    }

    if(values.email && dbUser.email !== values.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser) {
            return { error: "このメールアドレスは既に使用されています" };
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "確認メールを送信しました" };
    }
    
    if(values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);

        if(!passwordsMatch) {
            return { error: "現在のパスワードが正しくありません" };
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);

        values.password = hashedPassword
        values.newPassword = undefined

    }


    await db.user.update({
        where: { id: dbUser.id },
        data: { ...values }
    })

    return { success: "更新しました" };
}