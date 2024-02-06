import { CardWrapper } from "@/components/auth/card-wrapper"

export const LoginForm = () => {
    return (
       <CardWrapper
            headerLabel="welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
       >
            Login Form
       </CardWrapper>
    )
}