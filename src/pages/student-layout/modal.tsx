import { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import type { StudentTypes } from "../../types/student";
import { useStudent } from "../../hooks";
import { MaskedInput } from "antd-mask-input";

interface Props {
  open: boolean;
  onClose: () => void;
  onReload: () => void;
  editingStudent: StudentTypes | null;
}

export const ModalStudentForm = ({
  open,
  onClose,
  onReload,
  editingStudent,
}: Props) => {
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
    const { ...rest } = values;

    const formattedValues = {
      ...rest,
      date_of_birth: rest.date_of_birth
        ? rest.date_of_birth.format("YYYY-MM-DD")
        : undefined,
      lidId: rest.lidId ? parseInt(rest.lidId, 10) : null,
      password_hash: rest.password_hash
        ? String(rest.password_hash)
        : undefined,
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
      title={editingStudent ? "Edit Student" : "Add New Student"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: "Please enter first name" }]}>
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: "Please enter last name" }]}>
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}>
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^(\+998|998)?[0-9]{9}$/,
              message:
                "Please enter a valid phone number format (+998901234567)",
            },
          ]}>
          <MaskedInput
            mask="+998 00 000 00 00"
            placeholder="Enter phone number"
          />
        </Form.Item>

        <Form.Item
          name="password_hash"
          label="Password"
          rules={[
            { required: !editingStudent, message: "Please enter password" },
            {
              min: 8,
              message: "Password must be at least 8 characters long",
              type: "string",
            },
          ]}>
          <Input.Password placeholder="Enter password (minimum 8 characters)" />
        </Form.Item>

        {/* ✅ New section: Confirm Password */}
        <Form.Item
          name="confirm_password"
          label="Confirm Password"
          dependencies={["password_hash"]}
          rules={[
            {
              required: !editingStudent,
              message: "Please confirm your password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password_hash") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}>
          <Input.Password placeholder="Re-enter password" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender" }]}>
          <Select placeholder="Select gender">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date_of_birth"
          label="Date of Birth"
          rules={[{ required: true, message: "Please enter date of birth" }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="lidId"
          label="Lead ID"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (isNaN(value) || !Number.isInteger(Number(value))) {
                  return Promise.reject(
                    new Error("Lead ID must be a whole number")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}>
          <Input placeholder="Enter Lead ID" type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalStudentForm;
