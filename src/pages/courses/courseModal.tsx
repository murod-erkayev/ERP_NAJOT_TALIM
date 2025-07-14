import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect } from "react";
import type { CoursesTypes } from "../../types";

interface CourseModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  course?: CoursesTypes | null;
  loading?: boolean;
}

const { TextArea } = Input;
const { Option } = Select;

// Kurs nomlari options
const courseNameOptions = [
  { value: "Frontend Development", label: "Frontend Development" },
  { value: "Backend Development", label: "Backend Development" },
  { value: "Notion Design", label: "Notion Design" },
  { value: "Java Programming", label: "Java Programming" },
  { value: "Python Programming", label: "Python Programming" },
  { value: "React.js", label: "React.js" },
  { value: "Node.js", label: "Node.js" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "DevOps", label: "DevOps" },
  { value: "Data Science", label: "Data Science" },
];

// Narx options
const priceOptions = [
  { value: 0, label: "Bepul" },
  { value: 300000, label: "300,000 so'm" },
  { value: 500000, label: "500,000 so'm" },
  { value: 800000, label: "800,000 so'm" },
  { value: 1000000, label: "1,000,000 so'm" },
  { value: 1500000, label: "1,500,000 so'm" },
  { value: 2000000, label: "2,000,000 so'm" },
  { value: 3000000, label: "3,000,000 so'm" },
];

// Kurs davomiyligi options
const durationOptions = [
  { value: "1 hafta", label: "1 hafta" },
  { value: "2 hafta", label: "2 hafta" },
  { value: "1 oy", label: "1 oy" },
  { value: "2 oy", label: "2 oy" },
  { value: "3 oy", label: "3 oy" },
  { value: "4 oy", label: "4 oy" },
  { value: "6 oy", label: "6 oy" },
  { value: "1 yil", label: "1 yil" },
];

// Dars davomiyligi options
const lessonDurationOptions = [
  { value: "30 daqiqa", label: "30 daqiqa" },
  { value: "45 daqiqa", label: "45 daqiqa" },
  { value: "1 soat", label: "1 soat" },
  { value: "1.5 soat", label: "1.5 soat" },
  { value: "2 soat", label: "2 soat" },
  { value: "2.5 soat", label: "2.5 soat" },
  { value: "3 soat", label: "3 soat" },
  { value: "3.5 soat", label: "3.5 soat" },
];

export const CourseModal: React.FC<CourseModalProps> = ({
  open,
  onCancel,
  onSubmit,
  course,
  loading = false,
}) => {
  const [form] = Form.useForm();

  // Modal ochilganda form ma'lumotlarini to'ldirish
  useEffect(() => {
    if (open && course) {
      form.setFieldsValue({
        title: course.title || "",
        description: course.description || "",
        price: course.price || 0,
        duration: course.duration || "",
        lessons_in_a_week: course.lesson_in_a_week || 1,
        lesson_duration: course.lesson_duration || "",
      });
    } else if (open && !course) {
      // Yangi kurs uchun default qiymatlar
      form.setFieldsValue({
        title: "",
        description: "",
        price: 0,
        duration: "",
        lessons_in_a_week: 1,
        lesson_duration: "",
      });
    }
  }, [open, course, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={course ? "Kursni tahrirlash" : "Yangi kurs yaratish"}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={course ? "Saqlash" : "Yaratish"}
      cancelText="Bekor qilish"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: "",
          description: "",
          price: 0,
          duration: "",
          lessons_in_a_week: 1,
          lesson_duration: "",
        }}
      >
        <Form.Item
          name="title"
          label="Kurs nomi"
          rules={[
            { required: true, message: "Kurs nomi tanlanishi shart!" },
          ]}
        >
          <Select
            placeholder="Kurs nomini tanlang"
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {courseNameOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Tavsif"
          rules={[
            { required: true, message: "Tavsif kiritilishi shart!" },
            { min: 10, message: "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak!" },
          ]}
        >
          <TextArea 
            rows={4} 
            placeholder="Kurs haqida batafsil ma'lumot kiriting"
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="Narx"
          rules={[
            { required: true, message: "Narx tanlanishi shart!" },
          ]}
        >
          <Select placeholder="Kurs narxini tanlang">
            {priceOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="duration"
          label="Kurs davomiyligi"
          rules={[
            { required: true, message: "Davomiylik tanlanishi shart!" },
          ]}
        >
          <Select placeholder="Kurs davomiyligini tanlang">
            {durationOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="lessons_in_a_week"
          label="Haftada darslar soni"
          rules={[
            { required: true, message: "Haftada darslar soni kiritilishi shart!" },
            { type: "number", min: 1, message: "Kamida 1 ta dars bo'lishi kerak!" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Haftada nechta dars"
            min={1}
            max={7}
            precision={0}
          />
        </Form.Item>

        <Form.Item
          name="lesson_duration"
          label="Har bir dars davomiyligi"
          rules={[
            { required: true, message: "Dars davomiyligi tanlanishi shart!" },
          ]}
        >
          <Select placeholder="Dars davomiyligini tanlang">
            {lessonDurationOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseModal;