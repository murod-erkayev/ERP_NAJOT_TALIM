// 📁 src/hooks/useCourse.ts

import { useQuery } from "@tanstack/react-query";
import { CourseService } from "../service/course.service";

export const useCourse = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await CourseService.getAllCourse();
      return res?.data?.courses || [];
    },
  });

  const courseOptions =
    data?.map((course: any) => ({
      value: course.id,
      label: course.title,
    })) || [];
  return {
    data: courseOptions,  // ← Select uchun
    isLoading,
    error,
  };
};
