import { UserRole } from "@prisma/client"
import * as z from "zod"


export const SettingsSchema = z.object({
    name: z.optional(z.string()), // 名前はオプションであり、文字列であることを検証します
    isTwoFactorEnabled: z.optional(z.boolean()), // 2要素認証がオプションであり、ブール値であることを検証します
    role: z.enum([UserRole.ADMIN, UserRole.USER]), // ユーザーの役割が管理者またはユーザーであることを検証します
    email: z.optional(z.string().email()), // メールアドレスはオプションであり、有効なメールアドレスであることを検証します
    password: z.optional(z.string().min(6)), // パスワードはオプションであり、6文字以上であることを検証します
    newPassword: z.optional(z.string().min(6)), // 新しいパスワードはオプションであり、6文字以上であることを検証します
  })
    .refine((data) => {
      if (data.password && !data.newPassword) { // パスワードが存在し、新しいパスワードが存在しない場合は検証に失敗します
        return false;
      }
      return true;
    }, {
      message: "新しいパスワードを入力してください", // エラーメッセージを指定します
      path: ["newPassword"] // エラーパスを指定します
    })
    .refine((data) => {
      if (data.newPassword && !data.password) { // 新しいパスワードが存在し、現在のパスワードが存在しない場合は検証に失敗します
        return false;
      }
      return true;
    }, {
      message: "現在のパスワードを入力してください", // エラーメッセージを指定します
      path: ["password"] // エラーパスを指定します
})

        

export const LoginSchema = z.object({
    email: z.string().email({ message: "メールアドレスを登録してください" }),
    password: z.string().min(1, { message: "パスワードを入力してください" }),
    code: z.optional(z.string()),
})

export const RegisterSchema = z.object({
    email: z.string().email({ message: "メールアドレスを入力してください" }),
    password: z.string().min(6, { message: "6文字以上のパスワードを入力してください" }),
    name: z.string().min(1, { message: "名前を入力してください" }),
})


export const ResetSchema = z.object({
    email: z.string().email({ message: "メールアドレスを登録してください" }),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, { message: "6文字以上のパスワードを入力してください" }),
})