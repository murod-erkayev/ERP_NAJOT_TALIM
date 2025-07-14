import { ApiUrls } from '@api/api-urls';
import { apiConfig } from "../api/config"
import type { BranchesTypes } from "../types"

export const BrancheService = {
    getAllBranches (){
        return apiConfig().getRequest(ApiUrls.BRANCHES)
    },
    createBranche(model:BranchesTypes){
        return apiConfig().postRequest(ApiUrls.BRANCHES, model)
    },
    updateBranches(model:BranchesTypes, id:number){
        return apiConfig().putRequest(`${ApiUrls.BRANCHES}/${id}`, model)
    },
    deleteBranches(id:number){
        return apiConfig().deleteRequest(`${ApiUrls.BRANCHES}/${id}`, {})
    }
}