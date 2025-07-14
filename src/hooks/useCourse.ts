import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseService } from "../service/course.service";
import type { CoursesTypes } from "../types";

export const useCourse = () => {
  const queryClient = useQueryClient();

  const {
    data: rawCourses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await CourseService.getAllCourse();
      return res?.data?.courses || [];
    },
  });

  const createCourse = () => {
    return useMutation({
      mutationFn: async (data: CoursesTypes) =>
        CourseService.createCourse(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
    });
  };

  const updateCourse = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: CoursesTypes }) =>
        CourseService.updateCourse(data, id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
    });
  };

  const deleteCourse = () => {
    return useMutation({
      mutationFn: async ({ id }: { id: number }) =>
        CourseService.deleteCoruse(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
    });
  };

  // Select uchun variantlar
  const courseOptions =
    rawCourses?.map((course: any) => ({
      value: course.id,
      label: course.title,
    })) || [];

  return {
    data: rawCourses, // << To'liq ma'lumot (Courses sahifasi uchun)
    options: courseOptions, // << Faqat Select uchun kerak bo'lsa
    isLoading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
