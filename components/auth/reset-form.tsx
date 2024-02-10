"use client"
import * as z from "zod";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { useForm } from "react-hook-form";
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,  
} from "@/components/ui/form";
import { ResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useTransition, useState } from "react";
import { reset } from "@/actions/reset";



export const ResetForm = () => {
     const [error, setError] = useState<string | undefined>("")
     const [success, setSuccess] = useState<string | undefined>("")
     const [isPending, startTransition] = useTransition();
     

     const form = useForm<z.infer<typeof ResetSchema>>({
          resolver: zodResolver(ResetSchema),
          defaultValues: {
               email: "",
          }
     })

     const onSubmit = (value: z.infer<typeof ResetSchema>) => {
          startTransition(() => {
               reset(value)
               .then((data) => {
                    setError(data?.error)
                    setSuccess(data?.success)
               })
          })
     }


    return (
       <CardWrapper
            headerLabel="パスワードをリセットしてください"
            backButtonLabel="ログインへ戻る"
            backButtonHref="/auth/login"
            showSocial={false}
       >
            <Form {...form}>
               <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
               >
                    <div className="space-y-4">
                         <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                             <Input
                                                  {...field}
                                                  disabled={isPending}
                                                  placeholder="john.doe@example.com"
                                                  type="email" 
                                             />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>     
                              )}
                         >
                         </FormField>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                         type="submit"
                         className="w-full"
                    >
                         確認メールを送信
                    </Button>
               </form>
            </Form>
       </CardWrapper>
    )
}