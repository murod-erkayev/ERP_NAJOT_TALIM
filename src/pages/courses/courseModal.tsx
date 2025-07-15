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

// Course name options
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

// Price options
const priceOptions = [
  { value: 0, label: "Free" },
  { value: 300000, label: "300,000 UZS" },
  { value: 500000, label: "500,000 UZS" },
  { value: 800000, label: "800,000 UZS" },
  { value: 1000000, label: "1,000,000 UZS" },
  { value: 1500000, label: "1,500,000 UZS" },
  { value: 2000000, label: "2,000,000 UZS" },
  { value: 3000000, label: "3,000,000 UZS" },
];

// Course duration options
const durationOptions = [
  { value: "1 week", label: "1 week" },
  { value: "2 weeks", label: "2 weeks" },
  { value: "1 month", label: "1 month" },
  { value: "2 months", label: "2 months" },
  { value: "3 months", label: "3 months" },
  { value: "4 months", label: "4 months" },
  { value: "6 months", label: "6 months" },
  { value: "1 year", label: "1 year" },
];

// Lesson duration options
const lessonDurationOptions = [
  { value: "30 minutes", label: "30 minutes" },
  { value: "45 minutes", label: "45 minutes" },
  { value: "1 hour", label: "1 hour" },
  { value: "1.5 hours", label: "1.5 hours" },
  { value: "2 hours", label: "2 hours" },
  { value: "2.5 hours", label: "2.5 hours" },
  { value: "3 hours", label: "3 hours" },
  { value: "3.5 hours", label: "3.5 hours" },
];

export const CourseModal: React.FC<CourseModalProps> = ({
  open,
  onCancel,
  onSubmit,
  course,
  loading = false,
}) => {
  const [form] = Form.useForm();

  // Fill form data when modal opens
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
      // Default values for new course
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
      title={course ? "Edit Course" : "Create New Course"}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={course ? "Save" : "Create"}
      cancelText="Cancel"
      width={600}>
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
        }}>
        <Form.Item
          name="title"
          label="Course Name"
          rules={[{ required: true, message: "Course name is required!" }]}>
          <Select
            placeholder="Select course name"
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                ?.toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }>
            {courseNameOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Price is required!" }]}>
          <Select placeholder="Select course price">
            {priceOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="duration"
          label="Course Duration"
          rules={[{ required: true, message: "Duration is required!" }]}>
          <Select placeholder="Select course duration">
            {durationOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="lessons_in_a_week"
          label="Lessons per Week"
          rules={[
            {
              required: true,
              message: "Number of lessons per week is required!",
            },
            {
              type: "number",
              min: 1,
              message: "At least 1 lesson is required!",
            },
          ]}>
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Number of lessons per week"
            min={1}
            max={7}
            precision={0}
          />
        </Form.Item>

        <Form.Item
          name="lesson_duration"
          label="Duration per Lesson"
          rules={[{ required: true, message: "Lesson duration is required!" }]}>
          <Select placeholder="Select lesson duration">
            {lessonDurationOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Description is required!" },
            {
              min: 10,
              message: "Description must be at least 10 characters long!",
            },
          ]}>
          <TextArea
            rows={4}
            placeholder="Enter detailed information about the course"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseModal;
