import { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Input, Card, Row, Col, message } from "antd";
import { SearchOutlined, ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { useCourse } from "../../hooks"; // Bu sizning custom hook'ingiz
import type { CoursesTypes } from "../../types"; // Bu sizning type definitsiyangiz
import { CourseModal } from "./courseModal"; // Modal komponentini import qilish

const { Search } = Input;

export const Courses = () => {
  const [courses, setCourses] = useState<CoursesTypes[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CoursesTypes[]>([]);
  const [searchText, setSearchText] = useState("");
  
  // Modal holatlari
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CoursesTypes | null>(null);

  // Hooks
  // useCourse hookidan ma'lumotlar, yuklanish holati va xatolar olinmoqda
  const { data: courseData, isLoading, error, deleteCourse, createCourse, updateCourse } = useCourse();
  const deleteMutation = deleteCourse();
  const createMutation = createCourse();
  const updateMutation = updateCourse();

  // useEffect orqali courseData kelyapti va courses holatiga o'rnatilyapti
  useEffect(() => {
    if (courseData) {
      setCourses(courseData);
    } else {
      setCourses([]);
    }
  }, [courseData]);

  // Qidiruv funksionaliteti: searchText yoki courses o'zgarganda filtrlangan ro'yxat yangilanadi
  useEffect(() => {
    let filtered = [...courses];
    if (searchText) {
      filtered = filtered.filter((course) =>
        course.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  }, [courses, searchText]);

  // Kursni o'chirish funksiyasi
  const handleDelete = (course: CoursesTypes) => {
    deleteMutation.mutate(
      { id: course.id },
      {
        onSuccess: () => {
          message.success("Kurs muvaffaqiyatli o'chirildi");
          // O'chirilgan kursni lokal holatdan olib tashlash
          setCourses((prev) => prev.filter((c) => c.id !== course.id));
        },
        onError: (error) => {
          message.error("Kursni o'chirishda xatolik yuz berdi");
          console.error("Delete error:", error);
        },
      }
    );
  };

  // Yangi kurs yaratish uchun modal ochish
  const handleCreate = () => {
    setSelectedCourse(null);
    setModalOpen(true);
  };

  // Kursni tahrirlash uchun modal ochish
  const handleUpdate = (course: CoursesTypes) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  // Modal yopish
  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  // Modal submit (yaratish yoki tahrirlash)
  const handleModalSubmit = (values: any) => {
    if (selectedCourse) {
      // Kursni tahrirlash
      updateMutation.mutate(
        { id: selectedCourse.id, ...values },
        {
          onSuccess: (response) => {
            message.success("Kurs muvaffaqiyatli tahrirlandi");
            // response.data dan actual course ma'lumotini olish
            const updatedCourse = response!.data;
            if (updatedCourse) {
              setCourses((prev) =>
                prev.map((course) =>
                  course.id === selectedCourse.id 
                    ? { ...course, ...updatedCourse } 
                    : course
                )
              );
            }
            setModalOpen(false);
            setSelectedCourse(null);
          },
          onError: (error) => {
            message.error("Kursni tahrirlashda xatolik yuz berdi");
            console.error("Update error:", error);
          },
        }
      );
    } else {
      // Yangi kurs yaratish
      createMutation.mutate(
        values,
        {
          onSuccess: (response) => {
            message.success("Yangi kurs muvaffaqiyatli yaratildi");
            // response.data dan actual course ma'lumotini olish
            const newCourse = response!.data;
            if (newCourse) {
              setCourses((prev) => [...prev, newCourse]);
            }
            setModalOpen(false);
          },
          onError: (error) => {
            message.error("Kurs yaratishda xatolik yuz berdi");
            console.error("Create error:", error);
          },
        }
      );
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
      title: "Kurs nomi",
      dataIndex: "title",
      key: "title",
      sorter: (a: CoursesTypes, b: CoursesTypes) =>
        (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Tavsif",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Narx",
      dataIndex: "price",
      key: "price",
      render: (price: number) =>
        price ? `${price.toLocaleString()} so'm` : "Bepul",
      sorter: (a: CoursesTypes, b: CoursesTypes) =>
        (a.price || 0) - (b.price || 0),
    },
    {
      title: "Davomiyligi",
      dataIndex: "duration",
      key: "duration",
      render: (duration: string) =>
        duration || "Noma'lum",
    },
    {
      title: "Haftada darslar",
      dataIndex: "lessons_in_a_week",
      key: "lessons_in_a_week",
      render: (lessons: number) =>
        lessons ? `${lessons} ta` : "Noma'lum",
    },
    {
      title: "Dars davomiyligi",
      dataIndex: "lesson_duration",
      key: "lesson_duration",
      render: (lesson_duration: string) =>
        lesson_duration || "Noma'lum",
    },
    {
      title: "Holati",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) =>
        active ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Faol</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Faol emas</span>
        ),
      filters: [
        { text: "Faol", value: true },
        { text: "Faol emas", value: false },
      ],
      onFilter: (value: any, record: CoursesTypes) =>
        record.is_active === value,
    },
    {
      title: "Yaratilgan sana",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("uz-UZ") : "Noma'lum",
      sorter: (a: CoursesTypes, b: CoursesTypes) =>
        new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime(),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 120,
      render: (_: any, course: CoursesTypes) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleUpdate(course)}
            title="Tahrirlash"
          >
            ✏️
          </Button>
          <Popconfirm
            title="Kursni o'chirish"
            description="Rostdan ham bu kursni o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(course)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button
              type="link"
              danger
              size="small"
              title="O'chirish"
              loading={deleteMutation.isPending}
            >
              🗑️
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Xato yoki yuklanish holati
  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>Xato yuz berdi</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>Kurslar yuklanmoqda...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Kurslar</h1>

      {/* Filtrlar va Yangi kurs yaratish tugmasi */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Kurs nomi yoki tavsif..."
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
                disabled={!searchText}
              >
                Tozalash
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                Yangi kurs
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Jadval */}
      <Card>
        <Table
          dataSource={filteredCourses}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} ta kurs`,
            position: ["bottomCenter"],
          }}
          locale={{
            emptyText:
              filteredCourses.length === 0 && courses.length > 0
                ? "Hech qanday kurs topilmadi"
                : "Kurslar mavjud emas",
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
                      loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default Courses;