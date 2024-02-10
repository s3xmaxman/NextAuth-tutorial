import crypto from 'crypto';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';



export const generateTwoFactorToken = async(email: string) => {
    //  ランダムなトークンを生成する
    const token = crypto.randomInt(100_000,  1_000_000).toString();
    //  トークンの有効期限を設定する（現在の時間から5分後）
    const expires = new Date(new Date().getTime() +  5 * 60 *  1000);

    //  メールアドレスに関連する既存の二要素認証トークンを取得する
    const existingToken = await getTwoFactorTokenByEmail(email);

    // 既存のトークンがある場合、それを削除する
    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    //  新しい二要素認証トークンをデータベースに作成する
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    //  新しく作成された二要素認証トークンを返す
    return twoFactorToken
}






export const generatePasswordResetToken = async(email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken
}




export const generateVerificationToken = async(email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return verificationToken
}

