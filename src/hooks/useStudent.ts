import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StudentTypes } from "../types/student";
import { StudentSerivce } from "../service/student.service";
export const useStudent = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await StudentSerivce.getAllStudent();
      console.log("useStudent API javobi: Hooks", response.data.students); // API javobini tekshirish
      return response;
    },
  });
  const useStudentCreate = () =>
    useMutation({
      mutationFn: (data: StudentTypes) => StudentSerivce.createStudent(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
      },
    });
  const useStudentUpdate = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: StudentTypes }) =>
        StudentSerivce.updateStudent(data, id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
      },
    });
  const useStudentDelete = () =>
    useMutation({
      mutationFn: ({ id }: { id: number }) => StudentSerivce.deleteStudent(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
      },
    });
  return {
    data,
    isLoading,
    error,
    useStudentCreate,
    useStudentUpdate,
    useStudentDelete,
  };
};