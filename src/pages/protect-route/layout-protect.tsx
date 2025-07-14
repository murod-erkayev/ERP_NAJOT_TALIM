import React, { type ReactNode } from 'react'
import { GetItem } from '../../helper/storages'
import { Navigate } from 'react-router-dom'
import type { ProtectRoute } from '../../types'
export const LayoutProtect = ({children}:ProtectRoute) => {
    const token  = GetItem("access_token")
    if(!token){
        return <Navigate to="/" />
    }
  return (
    <>
    {children}
    </>
  )
}
export default LayoutProtect
