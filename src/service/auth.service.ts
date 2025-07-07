import { apiConfig } from "@api/config"
import { ApiUrls } from "@api/api-urls"
import { type SignIN } from "@types" 
export const authService = {
    async sigIn(model: SignIN, role:string):Promise<any> {
        const res = await apiConfig().postRequest(`${role}-auth${ApiUrls.AUTH}`,model)
        return res
    }
}