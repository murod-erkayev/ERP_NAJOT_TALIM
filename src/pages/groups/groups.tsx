import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm } from "antd";
import { GroupService } from "../../service/groups.service";
import type { GroupTypes } from "../../types/group";
import { ModalGroupForm } from "../../pages/groups/modal";

export const Groups = () => {
  const [groups, setGroups] = useState<GroupTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupTypes | null>(null);

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
    loadGroups();
  }, []);

  const handleDelete = (record: GroupTypes) => {
    GroupService.deleteGroup(record.id).then(() => loadGroups());
  };

  const handleUpdate = (record: GroupTypes) => {
    setEditingGroup(record);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };

  const columns = [
    {
      title: "ID",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Nomi",
      dataIndex: "name",
    },
    {
      title: "Kursi",
      dataIndex: "course_id",
    },
    {
      title: "Start",
      dataIndex: "start_date",
    },
    {
      title: "End",
      dataIndex: "end_date",
    },
    {
      title: "Status",
      dataIndex: "status",
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
      <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
        + Add Group
      </Button>
      <Table 
        dataSource={groups} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{
          pageSize: 7,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
          position: ['bottomCenter'],
        }}
      />
      <ModalGroupForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onReload={loadGroups}
        editingGroup={editingGroup}
      />
    </div>
  );
};