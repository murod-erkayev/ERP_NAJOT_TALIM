// GroupService.ts
import { apiConfig} from "@api/config";
import { ApiUrls } from "../api/api-urls";
import type { GroupTypes } from "../types/group";
import type { ParamsType } from "../types";
export const GroupService = {
  fetchGroups(params:ParamsType) {
    return apiConfig().getRequest(ApiUrls.GROUPS, params);
  },

  createGroup(model: GroupTypes) {
    return apiConfig().postRequest(ApiUrls.GROUPS, model);
  },

  updateGroup(id: number, model: GroupTypes) {
    return apiConfig().putRequest(`${ApiUrls.GROUPS}/${id}`,model); // yoki putRequest ishlatish mumkin
  },

  deleteGroup(id: number) {
    return apiConfig().deleteRequest(`${ApiUrls.GROUPS}/${id}`,{}); // yoki deleteRequest
  }
};
