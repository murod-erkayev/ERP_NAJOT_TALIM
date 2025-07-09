import axiosInstance from ".";
import { Notification } from "../helper/notification";

export function apiConfig() {
  async function getRequest(url: string, params: Object = {}) {
    try {
      const res = await axiosInstance.get(url, { params });
      return res;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Noma'lum xatolik";
      Notification("error", "GET so'rovida xatolik", msg);
      console.log("GetRequest", error);
      throw error; // ✅ Shart!
    }
  }
  async function postRequest(url: string, body: Object = {}) {
    try {
      const res = await axiosInstance.post(url, body);
      return res;
    } catch (error: any) {
    Notification("error", "POST so'rovida xatolik", error?.response?.data?.message);
      console.log("PostRequest", error);
    }
  }

  async function putRequest(url: string, body: Object = {}) {
    try {
      const res = await axiosInstance.patch(url, body);
      return res;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Noma'lum xatolik";
      Notification("error", "PUT so'rovida xatolik", msg);
      console.log("PutRequest", error);
    }
  }

  async function deleteRequest(url: string, params: Object = {}) {
    try {
      const res = await axiosInstance.delete(url, { params });
      return res;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Noma'lum xatolik";
      Notification("error", "DELETE so'rovida xatolik", msg);
      console.log("DeleteRequest", error);
    }
  }

  return {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
  };
}
