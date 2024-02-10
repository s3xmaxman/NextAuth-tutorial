"use client"

import { useSession } from "next-auth/react"
import { logout } from "@/actions/logout"
import { useCurrentUser } from "@/hooks/use-current-user"

const SettingsPage = () => {
  const user = useCurrentUser()

  const onClick = () => {
    logout()
  }

  return (
    <div className="bg-white p-10 rounded-xl">
        <form >
          <button onClick={onClick}>
              Sign out
          </button>
        </form>
    </div>
  )
}

export default SettingsPage