import { type SignIN } from './../types/auth';
import { useMutation } from "@tanstack/react-query"
import { authService } from '../service/auth.service';
export const useAuth = ()=>{
    return useMutation({
        mutationFn:async ({data, role}:{data:SignIN; role:string})=>authService.sigIn(data,role)
    })
}