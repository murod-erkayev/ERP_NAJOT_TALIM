import axiosInstance from ".";
import {Notification} from "../helper/notification";

export function apiConfig(){
    async function getRequest(url:string, params:Object={}){
        try {
            const res =await axiosInstance.get(url, {params})
            return res
        } catch (error:any) {
            console.log("GetRequst",error.response.message);
            Notification("error", error.response.message)
        }
    }
    async function postRequest(url:string, body:Object={}){
        try {
            const res =await axiosInstance.post(url, body)
            return res
        } catch (error:any) {
            Notification("error", error.response.message)
            console.log("PostRequest",error);
        }
    }
    async function putRequest(url:string, body:Object={}){
        try {
            const res = await axiosInstance.patch(url, body)
            return res
        } catch (error:any) {
            Notification("error", error.response?.data?.message || error.message)
            console.log("PostRequest",error);
        }
    }
    async function deleteRequest(url:string, params:Object={}){
        try {
            const res =await axiosInstance.delete(url, {params})
            return res
        } catch (error:any) {
            Notification("error", error.response.message)
            console.log("PostRequest",error);
        }
    }
    return {
        getRequest,
        postRequest,
        putRequest,
        deleteRequest
    }
}