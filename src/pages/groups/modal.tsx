// src/pages/groups/modal.tsx

import { Form, Input, Modal, Button, Select, DatePicker, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import type { GroupTypes } from "../../types/group";
import { useGroup } from "../../hooks/useGroup";
import React from "react";
import dayjs, { type Dayjs } from "dayjs";

// Form data type
interface FormData {
  name: string;
  course_id: string;
  start_date: Dayjs | null;
  end_date: Dayjs | null;
  status: string;
}

// Create type
type CreateGroupData = Omit<GroupTypes, "id" | "teacherId">;

interface Props {
  open: boolean;
  toggle: () => void;
  update: GroupTypes | null;
  mode: "create" | "update";
  courseMap: Record<number, string>;
}

const ModalGroupForm = ({ open, toggle, update, mode, courseMap }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      course_id: "",
      start_date: null,
      end_date: null,
      status: "",
    },
  });

  // Hooks
  const { useGroupCreate, useGroupUpdate } = useGroup({ page: 1, limit: 10 });
  const createMutation = useGroupCreate();
  const updateMutation = useGroupUpdate();

  // Course options
  const courseOptions = Object.entries(courseMap).map(([id, title]) => ({
    value: Number(id),
    label: title,
  }));

  // Fill form when updating
  React.useEffect(() => {
    if (mode === "update" && update) {
      reset({
        name: update.name || "",
        course_id: update.course_id?.toString() || "",
        start_date: update.start_date ? dayjs(update.start_date) : null,
        end_date: update.end_date ? dayjs(update.end_date) : null,
        status: update.status || "",
      });
    } else {
      reset({
        name: "",
        course_id: "",
        start_date: null,
        end_date: null,
        status: "",
      });
    }
  }, [mode, update, reset]);

  const onSubmit = (data: FormData) => {
    const formattedData: CreateGroupData = {
      name: data.name,
      course_id: Number(data.course_id),
      start_date: data.start_date ? data.start_date.format("YYYY-MM-DD") : "",
      end_date: data.end_date ? data.end_date.format("YYYY-MM-DD") : "",
      status: data.status,
    };

    if (mode === "update" && update) {
      updateMutation.mutate(
        { id: update.id, data: formattedData as any },
        {
          onSuccess: () => {
            message.success("Group updated successfully");
            reset();
            toggle();
          },
          onError: () => {
            message.error("Failed to update group");
          },
        }
      );
    } else {
      createMutation.mutate(formattedData as any, {
        onSuccess: () => {
          message.success("Group created successfully");
          reset();
          toggle();
        },
        onError: () => {
          message.error("Failed to create group");
        },
      });
    }
  };

  const handleCancel = () => {
    reset();
    toggle();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={mode === "update" ? "Edit Group" : "Add New Group"}
      centered
      open={open}
      onCancel={handleCancel}
      width={700}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit(onSubmit)}>
          {mode === "update" ? "Update" : "Create"}
        </Button>,
      ]}>
      <Form layout="vertical" autoComplete="off">
        <Form.Item
          label="Group Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Group name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter group name"
                disabled={isLoading}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Course"
          validateStatus={errors.course_id ? "error" : ""}
          help={errors.course_id?.message}>
          <Controller
            name="course_id"
            control={control}
            rules={{ required: "Course selection is required" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select course"
                disabled={isLoading}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={courseOptions}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Start Date"
          validateStatus={errors.start_date ? "error" : ""}
          help={errors.start_date?.message}>
          <Controller
            name="start_date"
            control={control}
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                placeholder="Select start date"
                disabled={isLoading}
                format="YYYY-MM-DD"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="End Date"
          validateStatus={errors.end_date ? "error" : ""}
          help={errors.end_date?.message}>
          <Controller
            name="end_date"
            control={control}
            rules={{ required: "End date is required" }}
            render={({ field }) => (
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                placeholder="Select end date"
                disabled={isLoading}
                format="YYYY-MM-DD"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          validateStatus={errors.status ? "error" : ""}
          help={errors.status?.message}>
          <Controller
            name="status"
            control={control}
            rules={{ required: "Status selection is required" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select status"
                disabled={isLoading}
                options={[
                  { value: "new", label: "New" },
                  { value: "active", label: "Active" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "pending", label: "Pending" },
                ]}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalGroupForm;
