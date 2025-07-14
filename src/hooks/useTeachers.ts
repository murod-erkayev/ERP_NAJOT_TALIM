import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TeacherSerivce } from "../service/teachers.service";
import type { TeacherTypes } from "../types/teacher";

export const useTeacher = () => {
  const queryClinet = useQueryClient();
  const { data } = useQuery({
    queryKey: ["teacher"],
    queryFn: async () => TeacherSerivce.getAllTeacher(),
  });

  const useTeacherCreate = () => {
    return useMutation({
      mutationFn: async (data: TeacherTypes) =>
        TeacherSerivce.createTeacher(data),
      onSuccess: () => {
        queryClinet.invalidateQueries({ queryKey: ["teacher"] });
      },
    });
  };

  const useTeacherUpdate = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: TeacherTypes }) =>
        TeacherSerivce.updateTeacher(data, id),
      onSuccess: () => {
        queryClinet.invalidateQueries({ queryKey: ["teacher"] });
      },
    });
  };

  const useTeacherDelete = () => {
    return useMutation({
      mutationFn: async (id: number) => TeacherSerivce.deleteTeacher(id),
      onSuccess: () => {
        queryClinet.invalidateQueries({ queryKey: ["teacher"] });
      },
    });
  };

  return {
    data,
    useTeacherCreate,
    useTeacherUpdate,
    useTeacherDelete,
  };
};
