import { GetItem } from '../../helper/storages'
import { Navigate } from 'react-router-dom'
import type { ProtectRoute } from '../../types'
export const LoginProtect = ({children}:ProtectRoute) => {
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
