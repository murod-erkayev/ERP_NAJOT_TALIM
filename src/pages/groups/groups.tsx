import { useEffect, useState, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal } from "react";
import { Table, Button, Space, Popconfirm, Input, Select, Row, Col, Card } from "antd";
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { GroupService } from "../../service/groups.service";
import type { GroupTypes } from "../../types/group";
import { ModalGroupForm } from "../../pages/groups/modal";
import { useGroup, useCourse } from "../../hooks";

const { Search } = Input;
const { Option } = Select;

export const Groups = () => {
  const [groups, setGroups] = useState<GroupTypes[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<GroupTypes[]>([]); // Filtrlangan grupalar
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupTypes | null>(null);
  
  // Filter state-lari
  const [searchText, setSearchText] = useState(""); // Nom bo'yicha qidiruv
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null); // Kurs filtri
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null); // Status filtri
  
  const { data, useGroupDelete } = useGroup();
  const { data: courseOptions } = useCourse();
  const deleteMutation = useGroupDelete();
  
  const loadGroups = () => {
    setLoading(true);
    GroupService.fetchGroups().then((res) => {
      setGroups(res?.data?.data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (data?.data?.data) {
      setGroups(data.data.data); 
    }
  }, [data]);

  // Filtrlash funksiyasi
  useEffect(() => {
    let filtered = [...groups];
    
    // Nom bo'yicha qidiruv
    if (searchText) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Kurs bo'yicha filtrlash
    if (selectedCourse) {
      filtered = filtered.filter(group => group.course_id === selectedCourse);
    }
    
    // Status bo'yicha filtrlash
    if (selectedStatus) {
      filtered = filtered.filter(group => group.status === selectedStatus);
    }
    
    setFilteredGroups(filtered);
  }, [groups, searchText, selectedCourse, selectedStatus]);

  const handleDelete = (record: GroupTypes) => {
    deleteMutation.mutate(
      { id: record.id },
      {
        onSuccess: () => {
          // Muvaffaqiyatli o'chirildi
        }
      }
    );
  };

  const handleUpdate = (record: GroupTypes) => {
    setEditingGroup(record);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };

  // Kurs ID orqali kurs nomini topish
  const getCourseNameById = (courseId: number) => {
    const course = courseOptions?.find((option: { value: number; }) => option.value === courseId);
    return course ? course.label : courseId;
  };

  // Barcha filtrlarni tozalash
  const clearAllFilters = () => {
    setSearchText("");
    setSelectedCourse(null);
    setSelectedStatus(null);
  };

  const columns = [
    {
      title: "ID",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Nomi",
      dataIndex: "name",
      sorter: (a: GroupTypes, b: GroupTypes) => a.name.localeCompare(b.name), // Nom bo'yicha saralash
    },
    {
      title: "Kursi",
      dataIndex: "course_id",
      render: (courseId: number) => {
        const courseName = getCourseNameById(courseId);
        return (
          <span style={{ 
            padding: '4px 8px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {courseName}
          </span>
        );
      },
    },
    {
      title: "Start",
      dataIndex: "start_date",
      sorter: (a: GroupTypes, b: GroupTypes) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    },
    {
      title: "End",
      dataIndex: "end_date",
      sorter: (a: GroupTypes, b: GroupTypes) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <span style={{ 
          color: status === 'active' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold'
        }}>
          {status === 'active' ? 'Faol' : 'Nofaol'}
        </span>
      ),
    },
    {
      title: "Amallar",
      render: (_: any, record: GroupTypes) => (
        <Space>
          <Button type="link" onClick={() => handleUpdate(record)}>✏️</Button>
          <Popconfirm title="O'chirishga ishonchingiz komilmi?" onConfirm={() => handleDelete(record)}>
            <Button type="link" danger>🗑</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Filter kartasi */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Guruh nomini qidiring..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Kursni tanlang"
              style={{ width: '100%' }}
              value={selectedCourse}
              onChange={setSelectedCourse}
              allowClear
            >
              {courseOptions?.map((course: { value: unknown; label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                <Option key={course.value as string | number} value={course.value}>
                  {course.label}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Statusni tanlang"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
            >
              <Option value="active">Faol</Option>
              <Option value="inactive">Nofaol</Option>
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button 
                icon={<ClearOutlined />} 
                onClick={clearAllFilters}
                disabled={!searchText && !selectedCourse && !selectedStatus}
              >
                Tozalash
              </Button>
              <Button type="primary" onClick={handleCreate}>
                + Guruh qo'shish
              </Button>
            </Space>
          </Col>
        </Row>
        
        {/* Natijalar haqida ma'lumot */}
        <div style={{ marginTop: 8, color: '#666', fontSize: '14px' }}>
          Jami {groups.length} tadan {filteredGroups.length} ta guruh ko'rsatilmoqda
          {searchText && ` • "${searchText}" bo'yicha qidiruv`}
          {selectedCourse && ` • ${getCourseNameById(selectedCourse)} kursi`}
          {selectedStatus && ` • ${selectedStatus === 'active' ? 'Faol' : 'Nofaol'} holati`}
        </div>
      </Card>

      {/* Jadval */}
      <Table 
        dataSource={filteredGroups} // Filtrlangan ma'lumotlar
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} / ${total} ta guruh`,
          position: ['bottomCenter'],
        }}
        locale={{
          emptyText: filteredGroups.length === 0 && groups.length > 0 
            ? "Hech qanday guruh topilmadi" 
            : "Guruhlar mavjud emas"
        }}
      />

      {/* Modal */}
      <ModalGroupForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onReload={loadGroups}
        editingGroup={editingGroup}
      />
    </div>
  );
};