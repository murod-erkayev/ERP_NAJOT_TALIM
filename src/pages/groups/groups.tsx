// src/pages/groups/Groups.tsx

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  type TablePaginationConfig,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { GroupTypes } from "../../types/group";
import { useGroup } from "../../hooks/useGroup";
import { CourseService } from "../../service/course.service";
import { useLocation, useNavigate } from "react-router-dom";
import useGeneral from "../../hooks/useGeneral";
import ModalGroupForm from "./modal";

export const Groups = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = Number(queryParams.get("page")) || 1;
  const initialLimit = Number(queryParams.get("limit")) || 7;

  // States
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupTypes | null>(null);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [courseMap, setCourseMap] = useState<Record<number, string>>({});

  // Hooks
  const { handlePagination } = useGeneral();
  const { data, useGroupDelete } = useGroup({
    page: currentPage,
    limit: pageSize,
  });
  const { mutate: deleteGroup, isPending: isDeleting } = useGroupDelete();

  // Load courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await CourseService.getAllCourse();
        const map: Record<number, string> = {};
        res?.data?.courses?.forEach((item: any) => {
          map[item.id] = item.title;
        });
        setCourseMap(map);
      } catch (error) {
        message.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  // Handlers
  const handleTableChange = (pagination: TablePaginationConfig) => {
    handlePagination({
      pagination,
      setParams: ({ page, limit }) => {
        setCurrentPage(page);
        setPageSize(limit);
      },
    });
  };

  const handleDelete = (record: GroupTypes) => {
    deleteGroup(record.id, {
      onSuccess: () => {
        message.success("Group deleted successfully");
      },
      onError: () => {
        message.error("Failed to delete group");
      },
    });
  };

  const handleUpdate = (record: GroupTypes) => {
    setEditingGroup(record);
    setMode("update");
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingGroup(null);
    setMode("create");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingGroup(null);
  };

  const handleViewDetails = (record: GroupTypes) => {
    navigate(`/admin/groups/${record.id}`);
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, record: GroupTypes) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          {record.name}
        </Button>
      ),
    },
    {
      title: "Course",
      dataIndex: "course_id",
      render: (id: number) => courseMap[id] || "–",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          new: "#1890ff",
          active: "#52c41a",
          completed: "#722ed1",
          cancelled: "#ff4d4f",
          pending: "#faad14",
        };
        return (
          <span
            style={{
              color: statusColors[status] || "#666",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}>
            {status}
          </span>
        );
      },
    },
    {
      title: "Actions",
      render: (_: any, record: GroupTypes) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this group?"
            onConfirm={() => handleDelete(record)}
            disabled={isDeleting}>
            <Button className="w-[20%]" loading={isDeleting}>
              🗑
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <h2>Groups</h2>
        <Button type="primary" onClick={handleCreate}>
          + Add Group
        </Button>
      </div>

      <Table<GroupTypes>
        dataSource={data?.data?.data}
        columns={columns}
        rowKey="id"
        loading={!data}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.data?.total || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "7", "10", "20"],
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} groups`,
          position: ["bottomCenter"],
        }}
        onChange={handleTableChange}
      />

      <ModalGroupForm
        open={modalOpen}
        toggle={handleCloseModal}
        update={editingGroup}
        mode={mode}
        courseMap={courseMap}
      />
    </div>
  );
};

export default Groups;
