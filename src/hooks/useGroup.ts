import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GroupService } from "../service/groups.service"
import type { GroupTypes } from "../types/group"
export const useGroup = () =>{
    const queryClinet = useQueryClient()
    const {data} = useQuery({
        queryKey:['groups'],
        queryFn:async ()=> GroupService.fetchGroups()
    })
    const useGroupCreate = () =>{
        return useMutation({
            mutationFn: async (data:GroupTypes)=>GroupService.createGroup(data),
            onSuccess:()=>{
                queryClinet.invalidateQueries({queryKey:["groups"]})
            }
        })
    }
    const useGroupUpdate = ()=>{
        return useMutation({
            mutationFn: async ({ id, data }: { id: number; data: GroupTypes }) => GroupService.updateGroup(id, data),
            onSuccess: () => {
                queryClinet.invalidateQueries({ queryKey: ["groups"] })
            }
        })
    }
    const useGroupDelete = ()=>{
        return useMutation({
            mutationFn: async ({ id}: { id: number}) => GroupService.deleteGroup(id),
            onSuccess: () => {
                queryClinet.invalidateQueries({ queryKey: ["groups"] })
            }
        })
    }
    return {
        data,
        useGroupCreate,
        useGroupUpdate,
        useGroupDelete
    }
}
