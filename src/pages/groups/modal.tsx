import { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import type { GroupTypes } from "../../types/group";
import { useCourse, useGroup } from "../../hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  onReload: () => void;
  editingGroup: GroupTypes | null;
}

export const ModalGroupForm = ({ open, onClose, onReload, editingGroup }: Props) => {
  const [form] = Form.useForm();
  const { useGroupCreate, useGroupUpdate } = useGroup();
  const createMutation = useGroupCreate();
  const updateMutation = useGroupUpdate();
  const { data: courseOptions, isLoading: loadingCourses } = useCourse();
  //Data 
  useEffect(() => {
    if (!open) return; 
    if (editingGroup) {
      form.setFieldsValue({
        ...editingGroup,
        start_date: dayjs(editingGroup.start_date),
        end_date: dayjs(editingGroup.end_date),
      });
    } else {
      form.resetFields();
    }
  }, [open, editingGroup, form]);


  const onFinish = (values: any) => {
    const formattedValues = {
      ...values,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
    };

    
    if (editingGroup) {
      updateMutation.mutate(
        { id: editingGroup.id, data: formattedValues },
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
  }


  return (
    <Modal
      title={editingGroup ? "Edit Group" : "Add New Group"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Group Name" rules={[{ required: true }]}>
          <Input placeholder="Write Group "/>
        </Form.Item>
        <Form.Item name="course_id" label="Select Course" rules={[{ required: true }]}>
          <Select options={courseOptions} placeholder="Choose Course"  loading={loadingCourses}/>
        </Form.Item>

        <Form.Item name="start_date" label="Start Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="end_date" label="End Date" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="status" label="Situvate" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "active", label: "Faol" },
              { value: "inactive", label: "Nofaol" },
            ]}
            placeholder="Holatni tanlang"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalGroupForm;
