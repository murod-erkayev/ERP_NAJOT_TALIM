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
} from "antd";
import { SearchOutlined, ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { useBranch } from "../../hooks"; // Bu sizning custom hook'ingiz
import type { BranchesTypes } from "../../types"; // Bu sizning type definitsiyangiz
import { BranchModal } from "./brancheMadol"; // Modal komponentini import qilish

const { Search } = Input;

export const Branches = () => {
  const [branches, setBranches] = useState<BranchesTypes[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<BranchesTypes[]>([]);
  const [searchText, setSearchText] = useState("");

  // Modal holatlari
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchesTypes | null>(
    null
  );

  // Hooks - sizning hook strukturangizga mos
  const {
    data: branchData,
    useBranchCreate,
    useBranchDelete,
    useBranchUpdate,
  } = useBranch();

  // Mutation hooks
  const createMutation = useBranchCreate();
  const updateMutation = useBranchUpdate();
  const deleteMutation = useBranchDelete();

  // useEffect orqali branchData kelyapti va branches holatiga o'rnatilyapti
  useEffect(() => {
    console.log("Branch data received:", branchData);

    if (branchData && branchData.data) {
      // Backend dan data.data.branch formatida kelishi mumkin
      const branchesData =
        branchData.data.data?.branch ||
        branchData.data.branch ||
        branchData.data ||
        [];

      console.log("Extracted branches:", branchesData);

      if (Array.isArray(branchesData)) {
        setBranches(branchesData);
      } else {
        console.log("Branches data is not array:", branchesData);
        setBranches([]);
      }
    } else {
      console.log("No branch data, setting empty array");
      setBranches([]);
    }
  }, [branchData]);

  // Qidiruv funksionaliteti
  useEffect(() => {
    let filtered = [...branches];
    if (searchText) {
      filtered = filtered.filter(
        (branch) =>
          branch.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          branch.address?.toLowerCase().includes(searchText.toLowerCase()) ||
          branch.call_number?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredBranches(filtered);
  }, [branches, searchText]);

  // Filialni o'chirish funksiyasi
  const handleDelete = (branch: any) => {
    deleteMutation.mutate(branch.id, {
      onSuccess: () => {
        message.success("Filial muvaffaqiyatli o'chirildi");
        setBranches((prev) => prev.filter((b: any) => b.id !== branch.id));
      },
      onError: (error) => {
        message.error("Filialni o'chirishda xatolik yuz berdi");
        console.error("Delete error:", error);
      },
    });
  };

  // Yangi filial yaratish uchun modal ochish
  const handleCreate = () => {
    setSelectedBranch(null);
    setModalOpen(true);
  };

  // Filialni tahrirlash uchun modal ochish
  const handleUpdate = (branch: any) => {
    setSelectedBranch(branch);
    setModalOpen(true);
  };

  // Modal yopish
  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedBranch(null);
  };

  // Modal submit (yaratish yoki tahrirlash)
  const handleModalSubmit = (values: any) => {
    if (selectedBranch) {
      // Filialni tahrirlash
      updateMutation.mutate(
        { id: (selectedBranch as any).id, data: values },
        {
          onSuccess: (response) => {
            message.success("Filial muvaffaqiyatli tahrirlandi");
            console.log("Update response:", response);

            // Backend'dan kelayotgan response formatiga qarab
            const updatedBranch =
              response?.data?.data?.branch ||
              response?.data?.branch ||
              response?.data ||
              values;

            setBranches((prev) =>
              prev.map((branch: any) =>
                branch.id === (selectedBranch as any).id
                  ? { ...branch, ...updatedBranch }
                  : branch
              )
            );
            setModalOpen(false);
            setSelectedBranch(null);
          },
          onError: (error) => {
            message.error("Filialni tahrirlashda xatolik yuz berdi");
            console.error("Update error:", error);
          },
        }
      );
    } else {
      // Yangi filial yaratish
      createMutation.mutate(values, {
        onSuccess: (response) => {
          message.success("Yangi filial muvaffaqiyatli yaratildi");
          console.log("Create response:", response);

          // Backend'dan kelayotgan response formatiga qarab
          const newBranch = response?.data?.data?.branch ||
            response?.data?.branch ||
            response?.data || { ...values, id: Date.now() };

          setBranches((prev) => [...prev, newBranch]);
          setModalOpen(false);
        },
        onError: (error) => {
          message.error("Filial yaratishda xatolik yuz berdi");
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
      title: "Filial nomi",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Manzil",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Telefon raqami",
      dataIndex: "call_number",
      key: "call_number",
      render: (phone: string) => phone || "Noma'lum",
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
      render: (_: any, branch: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleUpdate(branch)}
            title="Tahrirlash">
            ✏️
          </Button>
          <Popconfirm
            title="Filialni o'chirish"
            description="Rostdan ham bu filialni o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(branch)}
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

  // Loading va error holatlari - hook'dan keladigan ma'lumotlarga qarab
  const isLoading = !branchData; // Agar data yo'q bo'lsa, loading deb hisoblaymiz
  const error = null; // Hook'ingizda error yo'q, shuning uchun null

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>Filiallar yuklanmoqda...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Filiallar</h1>

      {/* Filtrlar va Yangi filial yaratish tugmasi */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Filial nomi, manzil yoki telefon..."
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
                Yangi filial
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Jadval */}
      <Card>
        <Table
          dataSource={filteredBranches}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} ta filial`,
            position: ["bottomCenter"],
          }}
          locale={{
            emptyText:
              filteredBranches.length === 0 && branches.length > 0
                ? "Hech qanday filial topilmadi"
                : "Filiallar mavjud emas",
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Modal */}
      <BranchModal
        open={modalOpen}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        branch={selectedBranch}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default Branches;
