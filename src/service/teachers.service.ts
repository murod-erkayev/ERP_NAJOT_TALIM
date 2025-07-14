import { apiConfig } from "../api/config"
import { ApiUrls } from "../api/api-urls"
import type { TeacherTypes } from "../types/teacher";

export const TeacherSerivce = {
    getAllTeacher(){
        return apiConfig().getRequest(ApiUrls.TEACHER)
    },
    createTeacher(model:TeacherTypes){
        return apiConfig().postRequest(ApiUrls.TEACHER, model);
    },
    updateTeacher(model:TeacherTypes, id:number){
        return apiConfig().putRequest(`${ApiUrls.TEACHER}/${id}`, model);
    },
    deleteTeacher(id:number){
        return apiConfig().deleteRequest(`${ApiUrls.TEACHER}/${id}`, {});
    }
}