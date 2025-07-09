import React, { type ReactNode } from 'react'
import { GetItem } from '../../helper/storages'
import { Navigate } from 'react-router-dom'

export const LoginProtect = ({children}:{children:ReactNode}) => {
    const token  = GetItem("access_token")
    const role = GetItem("role")
    if(token){
        return <Navigate to={`/${role}`} />
    }
  return (
    <>
    {children}
    </>
  )
}
export default LoginProtect
