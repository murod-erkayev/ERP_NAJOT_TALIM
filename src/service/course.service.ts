import { ApiUrls } from "../api/api-urls"
import { apiConfig } from "../api/config"

export const CourseService = {
    getAllCourse(){
        return apiConfig().getRequest(ApiUrls.Course)
    }
}