import { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import type { StudentTypes } from "../../types/student";
import { useStudent } from "../../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  onReload: () => void;
  editingStudent: StudentTypes | null;
}

export const ModalStudentForm = ({ open, onClose, onReload, editingStudent }: Props) => {
  const [form] = Form.useForm();
  const { useStudentCreate, useStudentUpdate } = useStudent();
  const createMutation = useStudentCreate();
  const updateMutation = useStudentUpdate();


  
  useEffect(() => {
    if (!open) return;
    if (editingStudent) {
      form.setFieldsValue({
        ...editingStudent,
        date_of_birth: editingStudent.date_of_birth
          ? dayjs(editingStudent.date_of_birth)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [open, editingStudent, form]);


//Data

  const onFinish = (values: any) => {
    const {...rest } = values;

    const formattedValues = {
      ...rest,
      date_of_birth: rest.date_of_birth
        ? rest.date_of_birth.format("YYYY-MM-DD")
        : undefined,
      lidId: rest.lidId ? parseInt(rest.lidId, 10) : null,
      password_hash: rest.password_hash ? String(rest.password_hash) : undefined,
    };

    if (editingStudent) {
      updateMutation.mutate(
        { id: editingStudent.id, data: formattedValues },
        {
          onSuccess: () => {
            form.resetFields();
            onClose();
            onReload();
          },
        }
      );
    } else {
      createMutation.mutate(formattedValues, {
        onSuccess: () => {
          form.resetFields();
          onClose();
          onReload();
        },
      });
    }
  };

  return (
    <Modal
      title={editingStudent ? "Talabani tahrirlash" : "Yangi talaba qo'shish"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="first_name"
          label="Ism"
          rules={[{ required: true, message: "Iltimos, ismini kiriting" }]}
        >
          <Input placeholder="Ism kiriting" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Familiya"
          rules={[{ required: true, message: "Iltimos, familiyasini kiriting" }]}
        >
          <Input placeholder="Familiya kiriting" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Iltimos, email kiriting" },
            { type: "email", message: "To'g'ri email manzil kiriting" },
          ]}
        >
          <Input placeholder="Email kiriting" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefon"
          rules={[
            { required: true, message: "Iltimos, telefon raqamini kiriting" },
            {
              pattern: /^(\+998|998)?[0-9]{9}$/,
              message: "To'g'ri telefon raqam formatini kiriting (+998901234567)",
            },
          ]}
        >
          <Input placeholder="+998901234567" />
        </Form.Item>

        <Form.Item
          name="password_hash"
          label="Parol"
          rules={[
            { required: !editingStudent, message: "Iltimos, parol kiriting" },
            {
              min: 8,
              message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
              type: "string",
            },
          ]}
        >
          <Input.Password placeholder="Parol kiriting (kamida 8 ta belgi)" />
        </Form.Item>

        {/* ✅ Yangi qism: Confirm Password */}
        <Form.Item
          name="confirm_password"
          label="Parolni tasdiqlang"
          dependencies={["password_hash"]}
          rules={[
            {
              required: !editingStudent,
              message: "Iltimos, parolni tasdiqlang",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password_hash") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Parollar mos kelmadi"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Parolni qayta kiriting" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Jins"
          rules={[{ required: true, message: "Iltimos, jinsni tanlang" }]}
        >
          <Select placeholder="Jinsni tanlang">
            <Select.Option value="male">Erkak</Select.Option>
            <Select.Option value="female">Ayol</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date_of_birth"
          label="Tug'ilgan sana"
          rules={[{ required: true, message: "Iltimos, tug'ilgan sanani kiriting" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="lidId"
          label="Lid ID"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (isNaN(value) || !Number.isInteger(Number(value))) {
                  return Promise.reject(new Error("lidId butun son bo'lishi kerak"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Lid ID kiriting" type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalStudentForm;
