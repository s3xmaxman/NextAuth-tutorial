"use server"


import * as z from "zod"

import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { generatePasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/mail"

export const reset = async (value: z.infer<typeof ResetSchema>) => {
    const verification = ResetSchema.safeParse(value)

    if (!verification.success) {
        return { error: "無効なメールアドレスです" }
    }

    const { email } = verification.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser) {
        return { error: "存在しないメールアドレスです" }
    }

    const verificationToken = await generatePasswordResetToken(email)

    await sendPasswordResetEmail(verificationToken.email, verificationToken.token)

    return { success: "メールを送信しました" }
}