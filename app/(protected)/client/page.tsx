"use client"


import { UserInfo } from "@/components/use-info"
import { useCurrentUser } from "@/hooks/use-current-user"

const Client = () => {
    const user = useCurrentUser()
    
    return (
        <div>
            <UserInfo 
                label="ユーザー情報(クライアント)"
                user={user}
            />
        </div>
    )
}

export default Client