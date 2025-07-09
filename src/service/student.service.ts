import { apiConfig } from "../api/config"
import { ApiUrls } from "../api/api-urls"
import type { StudentTypes } from "../types/student"

export const StudentSerivce = {
    getAllStudent(){
        return apiConfig().getRequest(ApiUrls.STUDENTS)
    },
    createStudent(model:StudentTypes){
        return apiConfig().postRequest(ApiUrls.STUDENTS, model)
    },
    updateStudent(model:StudentTypes, id:number){
        return apiConfig().putRequest(`${ApiUrls.STUDENTS}/${id}`, model)
    },
    deleteStudent(id:number){
        return apiConfig().deleteRequest(`${ApiUrls.STUDENTS}/${id}`, {})
    }
}