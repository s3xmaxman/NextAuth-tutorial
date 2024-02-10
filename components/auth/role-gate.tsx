"use client"

import { useCurrentRole  } from "@/hooks/use-current-role"
import { UserRole } from "@prisma/client"
import { FormError } from "@/components/form-error"

interface RoleGateProps {
    allowedRole: UserRole
    children: React.ReactNode
}

export const RoleGate = ({ allowedRole, children }: RoleGateProps) => {
    const currentRole = useCurrentRole()
    
    if (currentRole !== allowedRole) {
        return (
            <FormError message="このページにはアクセスできません。"/>
        )
    }

    return (
        <>{children}</>
    )
    
}