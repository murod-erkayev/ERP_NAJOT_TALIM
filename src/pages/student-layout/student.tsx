import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, Input, Select, Row, Col, Card } from "antd";
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
  const [editingStudent, setEditingStudent] = useState<StudentTypes | null>(null);

  // Filter state-lari
  const [searchText, setSearchText] = useState("");
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedActive, setSelectedActive] = useState<boolean | null>(null);

  // Hooks
  const { data: studentData, isLoading, error, useStudentDelete } = useStudent();
  const deleteMutation = useStudentDelete();

  // useEffect orqali data kelyapti
  useEffect(() => {
    if (studentData?.data?.students) {
      setStudents(studentData.data.students);
    } else {
      setStudents([]);
    }
  }, [studentData]);

  // Filtrlash
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
      filtered = filtered.filter((student) => student.gender === selectedGender);
    }

    if (selectedActive !== null) {
      filtered = filtered.filter((student) => student.is_active );
    }

    setFilteredStudents(filtered);
  }, [students, searchText, selectedGender, selectedActive]);

  // Delete
  const handleDelete = (student: StudentTypes) => {
    deleteMutation.mutate(
      { id: student.id },
      {
        onSuccess: () => {
          console.log("Talaba o‘chirildi:", student.id);
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

  // Jadval ustunlari
  const columns = [
    {
      title: "ID",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Ism",
      dataIndex: "first_name",
      sorter: (a: StudentTypes, b: StudentTypes) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      sorter: (a: StudentTypes, b: StudentTypes) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
    },
    {
      title: "Jins",
      dataIndex: "gender",
      render: (gender: string) => (gender === "male" ? "Erkak" : "Ayol"),
    },
    {
      title: "Tug‘ilgan sana",
      dataIndex: "date_of_birth",
      render: (date: string) => new Date(date).toLocaleDateString("uz-UZ"),
    },
    {
      title: "Holati",
      dataIndex: "is_active",
      render: (active: boolean) =>
        active ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Faol</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Faol emas</span>
        ),
    },
    {
      title: "Amallar",
      render: (_: any, student: StudentTypes) => (
        <Space>
          <Button type="link" onClick={() => handleUpdate(student)}>
            ✏️
          </Button>
          <Popconfirm
            title="O‘chirishga ishonchingiz komilmi?"
            onConfirm={() => handleDelete(student)}
          >
            <Button type="link" danger>
              🗑
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Xato yoki yuklanish holati
  if (error) return <div>Xato yuz berdi: {error.message}</div>;
  if (isLoading) return <div>Yuklanmoqda...</div>;

  return (
    <div>
      {/* Filtrlar */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Ism yoki familiya..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Jinsni tanlang"
              style={{ width: "100%" }}
              value={selectedGender}
              onChange={setSelectedGender}
              allowClear
            >
              <Option value="male">Erkak</Option>
              <Option value="female">Ayol</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Holatini tanlang"
              style={{ width: "100%" }}
              value={selectedActive}
              onChange={setSelectedActive}
              allowClear
            >
              <Option value={true}>Faol</Option>
              <Option value={false}>Faol emas</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space>
              <Button
                icon={<ClearOutlined />}
                onClick={clearAllFilters}
                disabled={!searchText && !selectedGender && selectedActive === null}
              >
                Tozalash
              </Button>
              <Button type="primary" onClick={handleCreate}>
                + Talaba qo‘shish
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Jadval */}
      <Table
        dataSource={filteredStudents}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} ta talaba`,
          position: ["bottomCenter"],
        }}
        locale={{
          emptyText:
            filteredStudents.length === 0 && students.length > 0
              ? "Hech qanday talaba topilmadi"
              : "Talabalar mavjud emas",
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
