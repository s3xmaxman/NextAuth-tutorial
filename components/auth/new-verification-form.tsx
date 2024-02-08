"use client"

import { useCallback, useEffect, useState } from "react"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { BeatLoader } from "react-spinners"
import { useSearchParams } from "next/navigation"
import { newVerification } from "@/actions/new-verification"
import { FormSuccess } from "@/components/form-success"
import { FormError } from "@/components/form-error"

export const NewVerificationForm = () => {
    const [error , setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    //  検索パラメータからトークンを取得します。
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    //  onSubmit関数をuseCallbackフックでメモ化し、依存配列にtoken、success、errorを指定します。
    const onSubmit = useCallback(() => {
        
        //  既に成功またはエラーメッセージが設定されている場合、関数を終了します。
        if (success || error) {
            return
        }

        //   トークンが存在しない場合、エラーメッセージを設定して関数を終了します。
        if (!token) {
            setError("認証トークンが不正です")
            return
        }    
        //   新しい認証処理を実行し、結果に基づいて成功メッセージまたはエラーメッセージを設定します。
        newVerification(token)
        .then((data) => {
          setSuccess(data.success);
          setError(data.error);
        })
        .catch(() => {
          //   何らかのエラーが発生した場合、一般的なエラーメッセージを設定します。
          setError("Something went wrong!");
        })
    }, [token, success, error]);

    //  useEffectフックを使用して、コンポーネントがマウントされたときにonSubmit関数を実行します。
    useEffect(() => {
        onSubmit()
    }, [onSubmit])


    return (
        <CardWrapper
            headerLabel="認証が完了しました!"
            backButtonHref="/auth/login"
            backButtonLabel="ログインに戻る"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <BeatLoader />
                )}
                <FormSuccess message={success} />
                {!success && (
                    <FormError message={error} />
                )}
            </div>
        </CardWrapper>
    )
}