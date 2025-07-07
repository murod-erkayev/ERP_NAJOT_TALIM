import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

import { GroupService } from "../../service/groups.service";
import { CourseService } from "../../service/course.service"; // Kurslar uchun servis
import type { GroupTypes } from "../../types/group";

interface Props {
  open: boolean;
  onClose: () => void;
  onReload: () => void;
  editingGroup: GroupTypes | null;
}

export const ModalGroupForm = ({ open, onClose, onReload, editingGroup }: Props) => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState<{ value: number; label: string }[]>([]);
  // ✅ Kurslar ro‘yxatini olish
  useEffect(() => {
    const fetchCourse = async ()=>{
      const res = await CourseService.getAllCourse()
      const option = res?.data?.courses.map((item:any)=>({
        value:item.id,
        label:item.title
      }));
      setCourses(option)
}
fetchCourse()
  }, []);  
  // ✅ Modal ochilganda formani to‘ldirish yoki tozalash
  useEffect(() => {
    if (!open) return; // Modal ochilmagan bo‘lsa, hech narsa qilmaymiz
  
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
  

  // ✅ Forma submit bo‘lganda
  const onFinish = (values: any) => {
    const formattedValues = {
      ...values,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
    };

    const request = editingGroup
      ? GroupService.updateGroup(editingGroup.id, formattedValues)
      : GroupService.createGroup(formattedValues);

    request?.then(() => {
      form.resetFields();  // <<<< ✅ Ma’lumot saqlangandan keyin inputlar tozalanadi
      onClose();
      onReload();
    });
  };

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
          <Select options={courses} placeholder="Choose Course" />
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
