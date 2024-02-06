import * as z from "zod"


export const LoginSchema = z.object({
    email: z.string().email({ message: "メールアドレスを登録してください" }),
    password: z.string().min(1, { message: "パスワードを入力してください" }),
})


