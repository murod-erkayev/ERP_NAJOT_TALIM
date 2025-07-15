import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";
import type { BranchesTypes } from "../../types";
import { MaskedInput } from "antd-mask-input";
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

  // Fill form data when modal opens
  useEffect(() => {
    if (open && branch) {
      form.setFieldsValue({
        name: branch.name || "",
        address: branch.address || "",
        call_number: branch.call_number || "",
      });
    } else if (open && !branch) {
      // Default values for new branch
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
      title={branch ? "Edit Branch" : "Create New Branch"}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={branch ? "Save" : "Create"}
      cancelText="Cancel"
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
          label="Branch Name"
          rules={[
            { required: true, message: "Branch name is required!" },
            {
              min: 3,
              message: "Branch name must be at least 3 characters long!",
            },
          ]}>
          <Input placeholder="Enter branch name" />
        </Form.Item>

        <Form.Item
          name="call_number"
          label="Phone Number"
          rules={[
            { required: true, message: "Phone number is required!" },
            {
              pattern: /^[\+]?[0-9\-\(\)\s]+$/,
              message: "Please enter a valid phone number format!",
            },
            {
              min: 9,
              message: "Phone number must be at least 9 digits long!",
            },
          ]}>
          <MaskedInput
            mask="+998 00 000 00 00"
            placeholder="Enter phone number"
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[
            { required: true, message: "Address is required!" },
            {
              min: 10,
              message: "Address must be at least 10 characters long!",
            },
          ]}>
          <Input.TextArea rows={3} placeholder="Enter full address" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BranchModal;
