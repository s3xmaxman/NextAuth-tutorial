"use client";

import { Span } from "next/dist/trace";
import { useRouter } from "next/navigation";


interface LoginButtonProps {
    children: React.ReactNode;
    mode: "modal" | 'redirect';
    asChild?: boolean;
}

export const LoginButton = ({ children, mode="redirect", asChild }: LoginButtonProps) => {
    const router = useRouter();
   
    const onClick = () => {
       router.push("/auth/login")
    }

    if (mode === "modal") {
      return (
          <span>
             Todo: Login Modal
          </span>
      )
    }


    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}