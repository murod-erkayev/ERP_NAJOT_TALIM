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
  Tag,
} from "antd";
import { SearchOutlined, ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { useTeacher } from "../../hooks"; // Teacher hook
import type { TeacherTypes } from "../../types/teacher";
import { TeacherModal } from "./teacherModal";

const { Search } = Input;

export const Teachers = () => {
  const [teachers, setTeachers] = useState<TeacherTypes[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherTypes[]>([]);
  const [searchText, setSearchText] = useState("");

  // Modal holatlari
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherTypes | null>(
    null
  );

  // Hooks
  const {
    data: teacherData,
    useTeacherCreate,
    useTeacherDelete,
    useTeacherUpdate,
  } = useTeacher();

  // Mutation hooks
  const createMutation = useTeacherCreate();
  const updateMutation = useTeacherUpdate();
  const deleteMutation = useTeacherDelete();

  // useEffect orqali teacherData kelyapti va teachers holatiga o'rnatilyapti
  useEffect(() => {
    console.log("Teacher data received:", teacherData);

    if (teacherData && teacherData.data) {
      // Backend dan data.teachers formatida kelyapti
      const teachersData =
        teacherData.data.teachers ||
        teacherData.data.data?.teachers ||
        teacherData.data ||
        [];

      console.log("Extracted teachers:", teachersData);

      if (Array.isArray(teachersData)) {
        setTeachers(teachersData);
      } else {
        console.log("Teachers data is not array:", teachersData);
        setTeachers([]);
      }
    } else {
      console.log("No teacher data, setting empty array");
      setTeachers([]);
    }
  }, [teacherData]);

  // Qidiruv funksionaliteti
  useEffect(() => {
    let filtered = [...teachers];
    if (searchText) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.first_name
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          teacher.last_name?.toLowerCase().includes(searchText.toLowerCase()) ||
          teacher.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          teacher.phone?.toLowerCase().includes(searchText.toLowerCase()) ||
          teacher.role?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredTeachers(filtered);
  }, [teachers, searchText]);

  // O'qituvchini o'chirish funksiyasi
  const handleDelete = (teacher: any) => {
    deleteMutation.mutate(teacher.id, {
      onSuccess: () => {
        message.success("O'qituvchi muvaffaqiyatli o'chirildi");
        setTeachers((prev) => prev.filter((t: any) => t.id !== teacher.id));
      },
      onError: (error) => {
        message.error("O'qituvchini o'chirishda xatolik yuz berdi");
        console.error("Delete error:", error);
      },
    });
  };

  // Yangi o'qituvchi yaratish uchun modal ochish
  const handleCreate = () => {
    setSelectedTeacher(null);
    setModalOpen(true);
  };

  // O'qituvchini tahrirlash uchun modal ochish
  const handleUpdate = (teacher: any) => {
    setSelectedTeacher(teacher);
    setModalOpen(true);
  };

  // Modal yopish
  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedTeacher(null);
  };

  // Modal submit (yaratish yoki tahrirlash)
  const handleModalSubmit = (values: any) => {
    console.log("=== TEACHER SUBMIT DEBUG ===");
    console.log("📋 Values received from modal:", values);
    console.log("👤 Selected teacher:", selectedTeacher);
    console.log("🔄 Is updating?", !!selectedTeacher);

    if (selectedTeacher) {
      // O'qituvchini tahrirlash
      const updateData = {
        id: (selectedTeacher as any).id,
        data: values,
      };

      console.log("🚀 UPDATE REQUEST:", updateData);

      updateMutation.mutate(updateData, {
        onSuccess: (response) => {
          console.log("✅ Update SUCCESS response:", response);
          message.success("O'qituvchi muvaffaqiyatli tahrirlandi");

          // Backend'dan kelayotgan response formatiga qarab
          const updatedTeacher =
            response?.data?.teachers ||
            response?.data?.data?.teachers ||
            response?.data ||
            values;

          setTeachers((prev) =>
            prev.map((teacher: any) =>
              teacher.id === (selectedTeacher as any).id
                ? { ...teacher, ...updatedTeacher }
                : teacher
            )
          );
          setModalOpen(false);
          setSelectedTeacher(null);
        }
      });
    } else {
      // Yangi o'qituvchi yaratish
      createMutation.mutate(values, {
        onSuccess: (response) => {
          message.success("Yangi o'qituvchi muvaffaqiyatli yaratildi");
          console.log("Create response:", response);

          // Backend'dan kelayotgan response formatiga qarab
          const newTeacher = response?.data?.teachers ||
            response?.data?.data?.teachers ||
            response?.data || { ...values, id: Date.now() };

          setTeachers((prev) => [...prev, newTeacher]);
          setModalOpen(false);
        },
        onError: (error) => {
          message.error("O'qituvchi yaratishda xatolik yuz berdi");
          console.error("Create error:", error);
        },
      });
    }
  };

  // Filtrlarni tozalash funksiyasi
  const clearFilters = () => {
    setSearchText("");
  };

  // Jadval ustunlari konfiguratsiyasi
  const columns = [
    {
      title: "ID",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
      sorter: (a: any, b: any) =>
        (a.first_name || "").localeCompare(b.first_name || ""),
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
      sorter: (a: any, b: any) =>
        (a.last_name || "").localeCompare(b.last_name || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "Noma'lum",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag
          color={
            role === "admin" ? "red" : role === "teacher" ? "blue" : "green"
          }>
          {role || "Noma'lum"}
        </Tag>
      ),
    },
    {
      title: "Filiallar",
      dataIndex: "branches",
      key: "branches",
      render: (branches: any[]) => {
        if (!branches || branches.length === 0) return "Filial biriktirilmagan";
        return branches.map((branch) => branch.name).join(", ");
      },
      width: 200,
      ellipsis: true,
    },
    {
      title: "Yaratilgan sana",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("uz-UZ") : "Noma'lum",
      sorter: (a: any, b: any) =>
        new Date(a.created_at || "").getTime() -
        new Date(b.created_at || "").getTime(),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 120,
      render: (_: any, teacher: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleUpdate(teacher)}
            title="Tahrirlash">
            ✏️
          </Button>
          <Popconfirm
            title="O'qituvchini o'chirish"
            description="Rostdan ham bu o'qituvchini o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(teacher)}
            okText="Ha"
            cancelText="Yo'q">
            <Button
              type="link"
              danger
              size="small"
              title="O'chirish"
              loading={deleteMutation.isPending}>
              🗑️
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Loading va error holatlari
  const isLoading = !teacherData;

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>O'qituvchilar yuklanmoqda...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>O'qituvchilar</h1>

      {/* Filtrlar va Yangi o'qituvchi yaratish tugmasi */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Ism, familiya, email, telefon..."
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
                Tozalash
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}>
                Yangi o'qituvchi
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Jadval */}
      <Card>
        <Table
          dataSource={filteredTeachers}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} ta o'qituvchi`,
            position: ["bottomCenter"],
          }}
          locale={{
            emptyText:
              filteredTeachers.length === 0 && teachers.length > 0
                ? "Hech qanday o'qituvchi topilmadi"
                : "O'qituvchilar mavjud emas",
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal */}
      <TeacherModal
        open={modalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        teacher={selectedTeacher}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default Teachers;
