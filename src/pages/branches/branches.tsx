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
import { useBranch } from "../../hooks"; // Your custom hook
import type { BranchesTypes } from "../../types"; // Your type definition
import { BranchModal } from "./brancheMadol"; // Import modal component

const { Search } = Input;

export const Branches = () => {
  const [branches, setBranches] = useState<BranchesTypes[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<BranchesTypes[]>([]);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchesTypes | null>(
    null
  );

  // Hooks - matching your hook structure
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

  // Setting branchData to branches state via useEffect
  useEffect(() => {
    console.log("Branch data received:", branchData);

    if (branchData && branchData.data) {
      // Backend might return data in data.data.branch format
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

  // Search functionality
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

  // Delete branch function
  const handleDelete = (branch: any) => {
    deleteMutation.mutate(branch.id, {
      onSuccess: () => {
        message.success("Branch deleted successfully");
        setBranches((prev) => prev.filter((b: any) => b.id !== branch.id));
      },
      onError: (error) => {
        message.error("Error occurred while deleting branch");
        console.error("Delete error:", error);
      },
    });
  };

  // Open modal for creating new branch
  const handleCreate = () => {
    setSelectedBranch(null);
    setModalOpen(true);
  };

  // Open modal for editing branch
  const handleUpdate = (branch: any) => {
    setSelectedBranch(branch);
    setModalOpen(true);
  };

  // Close modal
  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedBranch(null);
  };

  // Modal submit (create or edit)
  const handleModalSubmit = (values: any) => {
    if (selectedBranch) {
      // Edit branch
      updateMutation.mutate(
        { id: (selectedBranch as any).id, data: values },
        {
          onSuccess: (response) => {
            message.success("Branch updated successfully");
            console.log("Update response:", response);

            // Based on backend response format
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
            message.error("Error occurred while updating branch");
            console.error("Update error:", error);
          },
        }
      );
    } else {
      // Create new branch
      createMutation.mutate(values, {
        onSuccess: (response) => {
          message.success("New branch created successfully");
          console.log("Create response:", response);

          // Based on backend response format
          const newBranch = response?.data?.data?.branch ||
            response?.data?.branch ||
            response?.data || { ...values, id: Date.now() };

          setBranches((prev) => [...prev, newBranch]);
          setModalOpen(false);
        },
        onError: (error) => {
          message.error("Error occurred while creating branch");
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
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: "Branch Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Phone Number",
      dataIndex: "call_number",
      key: "call_number",
      render: (phone: string) => phone || "Unknown",
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("en-US") : "Unknown",
      sorter: (a: any, b: any) =>
        new Date(a.created_at || "").getTime() -
        new Date(b.created_at || "").getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, branch: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleUpdate(branch)}
            title="Edit">
            ✏️
          </Button>
          <Popconfirm
            title="Delete Branch"
            description="Are you sure you want to delete this branch?"
            onConfirm={() => handleDelete(branch)}
            okText="Yes"
            cancelText="No">
            <Button
              type="link"
              danger
              size="small"
              title="Delete"
              loading={deleteMutation.isPending}>
              🗑️
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Loading and error states - based on data from hook
  const isLoading = !branchData; // If no data, consider it loading
  const error = null; // No error in your hook, so null

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h3>Loading branches...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Branches</h1>

      {/* Filters and Create new branch button */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Branch name, address or phone..."
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
                New Branch
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
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
              `${range[0]}-${range[1]} of ${total} branches`,
            position: ["bottomCenter"],
          }}
          locale={{
            emptyText:
              filteredBranches.length === 0 && branches.length > 0
                ? "No branches found"
                : "No branches available",
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
