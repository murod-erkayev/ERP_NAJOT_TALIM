export interface TeacherTypes {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string; // Optional qilamiz chunki update'da kerak emas
  phone: string;
  role: string;
  is_active?: boolean;
  branches?: any[]; // Branch object'lari array'i
  branchId?: number[]; // POST uchun
}
