import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GroupService } from "../service/groups.service";
import type { GroupTypes } from "../types/group";
import type { ParamsType } from "../types/general";

export const useGroup = (params: ParamsType) => {
  const queryClinet = useQueryClient();
  const { data } = useQuery({
    queryKey: ["groups", params],
    queryFn: async () => GroupService.fetchGroups(params),
  });

  const useGroupCreate = () => {
    return useMutation({
      mutationFn: async (data: GroupTypes) => GroupService.createGroup(data),
      onSuccess: () => {
        queryClinet.invalidateQueries({ queryKey: ["groups"] });
      },
    });
  };
  const useGroupDelete = () => {
    return useMutation({
      mutationFn: async (id: number) => GroupService.deleteGroup(id),
      onSuccess: () => {
        queryClinet.invalidateQueries({ queryKey: ["groups"] });
      },
    });
  };

  const useGroupUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: GroupTypes }) =>
        GroupService.updateGroup(id, data),
    });
  };

  return {
    data,
    useGroupCreate,
    useGroupUpdate,
    useGroupDelete,
    // useGroupById,
  };
};
