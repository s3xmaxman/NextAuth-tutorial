import { PrismaClient } from "@prisma/client";


//  グローバルスコープにPrismaClientの型を追加します。
declare global {
    // PrismaClientのインスタンスが未定義の場合はundefinedとなります。
    var prisma: PrismaClient | undefined
}


//  グローバルスコープにPrismaClientのインスタンスが存在する場合はそれを使用し、
//  存在しない場合は新しいPrismaClientのインスタンスを作成してエクスポートします。
export const db = global.prisma || new PrismaClient()

//  開発環境である場合、グローバルスコープのPrismaClientのインスタンスを設定します。
if (process.env.NODE_ENV !== "production") global.prisma = db

