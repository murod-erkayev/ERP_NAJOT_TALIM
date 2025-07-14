import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";
import type { BranchesTypes } from "../../types";

interface BranchModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  branch?: BranchesTypes | null;
  loading?: boolean;
}

export const BranchModal: React.FC<BranchModalProps> = ({
  open,
  onCancel,
  onSubmit,
  branch,
  loading = false,
}) => {
  const [form] = Form.useForm();

  // Modal ochilganda form ma'lumotlarini to'ldirish
  useEffect(() => {
    if (open && branch) {
      form.setFieldsValue({
        name: branch.name || "",
        address: branch.address || "",
        call_number: branch.call_number || "",
      });
    } else if (open && !branch) {
      // Yangi filial uchun default qiymatlar
      form.setFieldsValue({
        name: "",
        address: "",
        call_number: "",
      });
    }
  }, [open, branch, form]);

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
      title={branch ? "Filialni tahrirlash" : "Yangi filial yaratish"}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={branch ? "Saqlash" : "Yaratish"}
      cancelText="Bekor qilish"
      width={500}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: "",
          address: "",
          call_number: "",
        }}>
        <Form.Item
          name="name"
          label="Filial nomi"
          rules={[
            { required: true, message: "Filial nomi kiritilishi shart!" },
            {
              min: 3,
              message:
                "Filial nomi kamida 3 ta belgidan iborat bo'lishi kerak!",
            },
          ]}>
          <Input placeholder="Filial nomini kiriting" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Manzil"
          rules={[
            { required: true, message: "Manzil kiritilishi shart!" },
            {
              min: 10,
              message: "Manzil kamida 10 ta belgidan iborat bo'lishi kerak!",
            },
          ]}>
          <Input.TextArea rows={3} placeholder="To'liq manzilni kiriting" />
        </Form.Item>

        <Form.Item
          name="call_number"
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
          <Input placeholder="+998 90 123 45 67" maxLength={20} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BranchModal;
