import { apiConfig } from "@api/config"
import { ApiUrls } from "@api/api-urls"
import { type SignIN } from "@types" 
export const authService = {
    async sigIn(model: SignIN) {
        const res = await apiConfig().postRequest(ApiUrls.ADMIN_AUTH_LOGIN,model)
        return res
    }
}