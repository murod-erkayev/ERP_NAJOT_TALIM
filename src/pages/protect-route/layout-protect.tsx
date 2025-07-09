import React, { type ReactNode } from 'react'
import { GetItem } from '../../helper/storages'
import { Navigate } from 'react-router-dom'

export const LayoutProtect = ({children}:{children:ReactNode}) => {
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
