import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BrancheService } from "../service/branches.service";
import type { BranchesTypes } from "../types";


export const useBranch = () => {
  const queryClinet = useQueryClient();
  const { data } = useQuery({
    queryKey: ["branch"],
    queryFn: async () => BrancheService.getAllBranches(),
  });

  const useBranchCreate = () => {
    return useMutation({
      mutationFn: async (data: BranchesTypes) => BrancheService.createBranche(data),
      onSuccess: () => {
        queryClinet.invalidateQueries({ queryKey: ["branch"] });
      },
    });
  };

  const useBranchUpdate = () => {
    return useMutation({
      mutationFn: async ({id, data}:{id:number;data: BranchesTypes}) => BrancheService.updateBranches(data,id),
      onSuccess: () => {
        queryClinet.invalidateQueries({ queryKey: ["branch"] });
      },
    });
  };

  const useBranchDelete = () => {
    return useMutation({
      mutationFn: async (id: number) => BrancheService.deleteBranches(id),
      onSuccess: () => {
        queryClinet.invalidateQueries({ queryKey: ["branch"] });
      },
    });
  };

  return {
    data,
    useBranchCreate,
    useBranchUpdate,
    useBranchDelete,
  };
};
