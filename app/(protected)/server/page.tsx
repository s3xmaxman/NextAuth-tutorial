
import { UserInfo } from '@/components/use-info'
import { currentUser } from '@/lib/auth'
import React from 'react'

const ServerPage = async() => {
    const user =  await currentUser()
  return (
    <div>
      <UserInfo 
        label="ユーザー情報(サーバー)"
        user={user}
      />
    </div>
  )
}

export default ServerPage