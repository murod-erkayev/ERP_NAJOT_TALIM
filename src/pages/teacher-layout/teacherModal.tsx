import { Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import type { TeacherTypes } from "../../types/teacher";
import { useBranch } from "../../hooks"; // Branch hook'ini import qiling
import { MaskedInput } from "antd-mask-input";

interface TeacherModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  teacher?: TeacherTypes | null;
  loading?: boolean;
}

const { Option } = Select;

export const TeacherModal: React.FC<TeacherModalProps> = ({
  open,
  onCancel,
  onSubmit,
  teacher,
  loading = false,
}) => {
  const [form] = Form.useForm();

  // Branch hook'ini ishlatish
  const { data: branchData } = useBranch();

  // Modal ochilganda form ma'lumotlarini to'ldirish
  useEffect(() => {
    if (open && teacher) {
      form.setFieldsValue({
        first_name: teacher.first_name || "",
        last_name: teacher.last_name || "",
        email: teacher.email || "",
        password: "", // Parolni bo'sh qoldiramiz xavfsizlik uchun
        phone: teacher.phone || "",
        role: teacher.role || "teacher",
        branchId: teacher.branches
          ? teacher.branches.map((branch: any) => branch.id)
          : [],
      });
    } else if (open && !teacher) {
      // Yangi o'qituvchi uchun default qiymatlar
      form.setFieldsValue({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        role: "teacher",
        branchId: [],
      });
    }
  }, [open, teacher, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Agar tahrirlash rejimida bo'lsa va parol bo'sh bo'lsa, parolni o'chirib tashlaymiz
      if (teacher && !values.password) {
        delete values.password;
      }

      onSubmit(values);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Branchlar va rolelarni extract qilish
  const branches =
    branchData?.data?.branch ||
    branchData?.data?.data?.branch ||
    branchData?.data ||
    [];

  // Backend'da mavjud role'lar (sizning response'ga qarab)
  const roles = [
    { value: "main teacher", label: "Asosiy o'qituvchi" },
    { value: "teacher", label: "O'qituvchi" },
    { value: "admin", label: "Administrator" },
    { value: "manager", label: "Menejer" },
  ];

  return (
    <Modal
      title={teacher ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi yaratish"}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={teacher ? "Saqlash" : "Yaratish"}
      cancelText="Bekor qilish"
      width={600}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone: "",
          role: "teacher",
          branchId: [],
        }}>
        <Form.Item
          name="first_name"
          label="Ism"
          rules={[
            { required: true, message: "Ism kiritilishi shart!" },
            {
              min: 2,
              message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak!",
            },
            {
              max: 50,
              message: "Ism 50 ta belgidan oshmasligi kerak!",
            },
          ]}>
          <Input placeholder="Ismni kiriting" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Familiya"
          rules={[
            { required: true, message: "Familiya kiritilishi shart!" },
            {
              min: 2,
              message: "Familiya kamida 2 ta belgidan iborat bo'lishi kerak!",
            },
            {
              max: 50,
              message: "Familiya 50 ta belgidan oshmasligi kerak!",
            },
          ]}>
          <Input placeholder="Familiyani kiriting" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email kiritilishi shart!" },
            {
              type: "email",
              message: "To'g'ri email formatini kiriting!",
            },
          ]}>
          <Input placeholder="email@example.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label={teacher ? "Parol (bo'sh qoldirish mumkin)" : "Parol"}
          rules={
            teacher
              ? [
                  {
                    min: 6,
                    message:
                      "Parol kamida 6 ta belgidan iborat bo'lishi kerak!",
                  },
                ]
              : [
                  { required: true, message: "Parol kiritilishi shart!" },
                  {
                    min: 6,
                    message:
                      "Parol kamida 6 ta belgidan iborat bo'lishi kerak!",
                  },
                ]
          }>
          <Input.Password
            placeholder={
              teacher ? "Yangi parol (ixtiyoriy)" : "Parolni kiriting"
            }
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefon raqami"
          rules={[
            { required: true, message: "Telefon raqami kiritilishi shart!" },
            {
              pattern: /^[\+]?[0-9\-\(\)\s]+$/,
              message: "To'g'ri telefon raqami formatini kiriting!",
            },
            {
              min: 9,
              message:
                "Telefon raqami kamida 9 ta raqamdan iborat bo'lishi kerak!",
            },
          ]}>
          <MaskedInput
            mask="+998 00 000 00 00"
            placeholder="Enter phone number"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Rol"
          rules={[{ required: true, message: "Rol tanlanishi shart!" }]}>
          <Select placeholder="Rolni tanlang">
            {roles.map((role: any) => (
              <Option key={role.value} value={role.value}>
                {role.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="branchId"
          label="Filial"
          rules={[{ required: true, message: "Filial tanlanishi shart!" }]}>
          <Select
            mode="multiple"
            placeholder="Filiallarni tanlang"
            loading={!branchData}
            allowClear>
            {Array.isArray(branches) &&
              branches.map((branch: any) => (
                <Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TeacherModal;
