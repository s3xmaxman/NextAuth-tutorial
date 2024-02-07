import * as z from "zod"


export const LoginSchema = z.object({
    email: z.string().email({ message: "メールアドレスを登録してください" }),
    password: z.string().min(1, { message: "パスワードを入力してください" }),
})

export const RegisterSchema = z.object({
    email: z.string().email({ message: "メールアドレスを入力してください" }),
    password: z.string().min(6, { message: "6文字以上のパスワードを入力してください" }),
    name: z.string().min(1, { message: "名前を入力してください" }),
})


