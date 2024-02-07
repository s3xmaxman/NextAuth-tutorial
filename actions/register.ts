"use server"

import * as z from "zod"
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"
import { RegisterSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"

export const register = async(values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error:"無効な入力があります" }
    }

    const { email, password, name } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { error: "このメールアドレスは既に使われています" }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    // TODO: send verification email

    return { success: "登録に成功しました" }
}