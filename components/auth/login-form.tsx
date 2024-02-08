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
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Login } from "@/actions/login";
import { useTransition, useState } from "react";
import { useSearchParams } from "next/navigation";


export const LoginForm = () => {
     const searchParams = useSearchParams();
     const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "別のプロバイダーで使用しているメールアドレスです" :""
     const [error, setError] = useState<string | undefined>("")
     const [success, setSuccess] = useState<string | undefined>("")
     const [isPending, startTransition] = useTransition();
     

     const form = useForm<z.infer<typeof LoginSchema>>({
          resolver: zodResolver(LoginSchema),
          defaultValues: {
               email: "",
               password: "",
          }
     })

     const onSubmit = (value: z.infer<typeof LoginSchema>) => {
          startTransition(() => {
               Login(value)
               .then((data) => {
                    setError(data?.error)
                    setSuccess(data?.success)
               })
          })
     }


    return (
       <CardWrapper
            headerLabel="おかえりなさい！"
            backButtonLabel="新規登録はこちらから"
            backButtonHref="/auth/register"
            showSocial
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
                         <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                             <Input
                                                  {...field}
                                                  disabled={isPending}
                                                  placeholder="**********"
                                                  type="password" 
                                             />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>     
                              )}
                         >

                         </FormField>
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                         type="submit"
                         className="w-full"
                    >
                         ログイン
                    </Button>
               </form>
            </Form>
       </CardWrapper>
    )
}