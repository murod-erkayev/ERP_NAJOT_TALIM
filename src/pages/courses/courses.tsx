import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Input,
  Card,
  Row,
  Col,
  message,
  type TablePaginationConfig,
} from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useCourse } from "../../hooks";
import type { CoursesTypes } from "../../types";
import { CourseModal } from "./courseModal";
import useGeneral from "../../hooks/useGeneral";

const { Search } = Input;

export const Courses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = Number(queryParams.get("page")) || 1;
  const initialLimit = Number(queryParams.get("limit")) || 10;

  // States
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);
  const [courses, setCourses] = useState<CoursesTypes[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CoursesTypes[]>([]);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CoursesTypes | null>(
    null
  );
  const [mode, setMode] = useState<"create" | "update">("create");

  // Hooks
  const { handlePagination } = useGeneral();
  const {
    data: courseData,
    isLoading,
    error,
    deleteCourse,
    createCourse,
    updateCourse,
  } = useCourse({
    page: currentPage,
    limit: pageSize,
  });

  const deleteMutation = deleteCourse();
  const createMutation = createCourse();
  const updateMutation = updateCourse();

  // Load courses data
  useEffect(() => {
    if (courseData?.data?.data) {
      setCourses(courseData.data.data);
    } else {
      setCourses([]);
    }
  }, [courseData]);

  // Search functionality: filtered list updates when searchText or courses change
  useEffect(() => {
    let filtered = [...courses];
    if (searchText) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  }, [courses, searchText]);

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

  // Delete course function
  const handleDelete = (course: CoursesTypes) => {
    deleteMutation.mutate(
      { id: course.id },
      {
        onSuccess: () => {
          message.success("Course deleted successfully");
        },
        onError: (error) => {
          message.error("Error occurred while deleting course");
          console.error("Delete error:", error);
        },
      }
    );
  };

  // Open modal for creating new course
  const handleCreate = () => {
    setSelectedCourse(null);
    setMode("create");
    setModalOpen(true);
  };

  // Open modal for editing course
  const handleUpdate = (course: CoursesTypes) => {
    setSelectedCourse(course);
    setMode("update");
    setModalOpen(true);
  };

  // Close modal
  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  // View course details
  const handleViewDetails = (course: CoursesTypes) => {
    navigate(`/admin/courses/${course.id}`);
  };

  // Modal submit (create or edit)
  const handleModalSubmit = (values: any) => {
    if (mode === "update" && selectedCourse) {
      // Edit course
      updateMutation.mutate(
        { id: selectedCourse.id, data: values },
        {
          onSuccess: () => {
            message.success("Course updated successfully");
            setModalOpen(false);
            setSelectedCourse(null);
          },
          onError: (error) => {
            message.error("Error occurred while updating course");
            console.error("Update error:", error);
          },
        }
      );
    } else {
      // Create new course
      createMutation.mutate(values, {
        onSuccess: () => {
          message.success("New course created successfully");
          setModalOpen(false);
        },
        onError: (error) => {
          message.error("Error occurred while creating course");
          console.error("Create error:", error);
        },
      });
    }
  };

  // Clear filters function
  const clearFilters = () => {
    setSearchText("");
  };

  // Table columns configuration
  const columns = [
    {
      title: "ID",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 60,
    },
    {
      title: "Course Name",
      dataIndex: "title",
      key: "title",
      render: (_: any, record: CoursesTypes) => (
        <Button type="link" onClick={() => handleViewDetails(record)}>
          {record.title}
        </Button>
      ),
      sorter: (a: CoursesTypes, b: CoursesTypes) =>
        (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) =>
        price ? `${price.toLocaleString()} UZS` : "Free",
      sorter: (a: CoursesTypes, b: CoursesTypes) =>
        (a.price || 0) - (b.price || 0),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: string) => duration || "Unknown",
    },
    {
      title: "Lessons per Week",
      dataIndex: "lessons_in_a_week",
      key: "lessons_in_a_week",
      render: (lessons: number) => (lessons ? `${lessons}` : "Unknown"),
    },
    {
      title: "Lesson Duration",
      dataIndex: "lesson_duration",
      key: "lesson_duration",
      render: (lesson_duration: string) => lesson_duration || "Unknown",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) =>
        active ? (
          <span style={{ color: "#52c41a", fontWeight: "bold" }}>Active</span>
        ) : (
          <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>Inactive</span>
        ),
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value: any, record: CoursesTypes) =>
        record.is_active === value,
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("en-US") : "Unknown",
      sorter: (a: CoursesTypes, b: CoursesTypes) =>
        new Date(a.created_at || "").getTime() -
        new Date(b.created_at || "").getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, course: CoursesTypes) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleUpdate(course)}
            title="Edit"
          />
          <Popconfirm
            title="Delete Course"
            description="Are you sure you want to delete this course?"
            onConfirm={() => handleDelete(course)}
            okText="Yes"
            cancelText="No"
            disabled={deleteMutation.isPending}>
            <Button danger title="Delete" loading={deleteMutation.isPending}>
              🗑️
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Error or loading state
  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>An error occurred</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Courses</h1>

      {/* Filters and Create new course button */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Course name or description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={16}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                icon={<ClearOutlined />}
                onClick={clearFilters}
                disabled={!searchText}>
                Clear
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}>
                New Course
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Results info */}
        <div style={{ marginTop: 8, color: "#666", fontSize: "14px" }}>
          Showing {filteredCourses.length} of {courses.length} courses
          {searchText && ` • Search: "${searchText}"`}
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table<CoursesTypes>
          dataSource={filteredCourses}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: courseData?.data?.total || 0,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
            position: ["bottomCenter"],
          }}
          locale={{
            emptyText:
              filteredCourses.length === 0 && courses.length > 0
                ? "No courses found"
                : "No courses available",
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Modal */}
      <CourseModal
        open={modalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        course={selectedCourse}
        mode={mode}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default Courses;
