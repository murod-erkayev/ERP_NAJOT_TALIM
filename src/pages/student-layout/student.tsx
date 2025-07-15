import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Input,
  Select,
  Row,
  Col,
  Card,
} from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import type { StudentTypes } from "../../types/student";
import { ModalStudentForm } from "../../pages/student-layout/modal";
import { useStudent } from "../../hooks";

const { Search } = Input;
const { Option } = Select;

export const Students = () => {
  const [students, setStudents] = useState<StudentTypes[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentTypes[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentTypes | null>(
    null
  );

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedActive, setSelectedActive] = useState<boolean | null>(null);

  // Hooks
  const {
    data: studentData,
    isLoading,
    error,
    useStudentDelete,
  } = useStudent();
  const deleteMutation = useStudentDelete();

  // Load data via useEffect
  useEffect(() => {
    if (studentData?.data?.students) {
      setStudents(studentData.data.students);
    } else {
      setStudents([]);
    }
  }, [studentData]);

  // Filtering
  useEffect(() => {
    let filtered = [...students];

    if (searchText) {
      filtered = filtered.filter((student) =>
        `${student.first_name} ${student.last_name}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    if (selectedGender) {
      filtered = filtered.filter(
        (student) => student.gender === selectedGender
      );
    }

    if (selectedActive !== null) {
      filtered = filtered.filter((student) => student.is_active);
    }

    setFilteredStudents(filtered);
  }, [students, searchText, selectedGender, selectedActive]);

  // Delete
  const handleDelete = (student: StudentTypes) => {
    deleteMutation.mutate(
      { id: student.id },
      {
        onSuccess: () => {
          console.log("Student deleted:", student.id);
          setStudents((prev) => prev.filter((s) => s.id !== student.id));
        },
      }
    );
  };

  // Create / Edit
  const handleUpdate = (student: StudentTypes) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  const clearAllFilters = () => {
    setSearchText("");
    setSelectedGender(null);
    setSelectedActive(null);
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: (a: StudentTypes, b: StudentTypes) =>
        a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: (a: StudentTypes, b: StudentTypes) =>
        a.last_name.localeCompare(b.last_name),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (gender: string) => (gender === "male" ? "Male" : "Female"),
    },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      render: (date: string) => new Date(date).toLocaleDateString("en-US"),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (active: boolean) =>
        active ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Active</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Inactive</span>
        ),
    },
    {
      title: "Actions",
      render: (_: any, student: StudentTypes) => (
        <Space>
          <Button type="link" onClick={() => handleUpdate(student)}>
            ✏️
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this student?"
            onConfirm={() => handleDelete(student)}>
            <Button type="link" danger>
              🗑
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Error or loading states
  if (error) return <div>Error occurred: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Search by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Choose Gender"
              style={{ width: "100%" }}
              value={selectedGender}
              onChange={setSelectedGender}
              allowClear>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Select Status"
              style={{ width: "100%" }}
              value={selectedActive}
              onChange={setSelectedActive}
              allowClear>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space>
              <Button
                icon={<ClearOutlined />}
                onClick={clearAllFilters}
                disabled={
                  !searchText && !selectedGender && selectedActive === null
                }>
                Clear Filters
              </Button>
              <Button type="primary" onClick={handleCreate}>
                + Add Student
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table
        dataSource={filteredStudents}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} students`,
          position: ["bottomCenter"],
        }}
        locale={{
          emptyText:
            filteredStudents.length === 0 && students.length > 0
              ? "No students found"
              : "No students available",
        }}
      />

      {/* Modal */}
      <ModalStudentForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onReload={() => {}}
        editingStudent={editingStudent}
      />
    </div>
  );
};
