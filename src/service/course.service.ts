import { string } from "yup"
import { ApiUrls } from "../api/api-urls"
import { apiConfig } from "../api/config"
import type { CoursesTypes } from "../types"

export const CourseService = {
    getAllCourse(){
        return apiConfig().getRequest(ApiUrls.Course)
    },
    createCourse(model:CoursesTypes){
        return apiConfig().postRequest(ApiUrls.Course, model)
    },
    updateCourse(model:CoursesTypes, id:number){
        return apiConfig().putRequest(`${ApiUrls.Course}/${id}`, model)
    },
    deleteCoruse(id:number){
        return apiConfig().deleteRequest(`${ApiUrls.Course}/${id}`,{})
    }
}