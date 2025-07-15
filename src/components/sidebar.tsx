// components/admin/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  ShopOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();

  const items: MenuItem[] = [
    {
      key: "/admin/",
      icon: <TeamOutlined />,
      label: <Link to="/admin/">Groups</Link>,
    },
    {
      key: "/admin/students",
      icon: <UserOutlined />,
      label: <Link to="/admin/students">Students</Link>,
    },
    {
      key: "/admin/courses",
      icon: <BookOutlined />,
      label: <Link to="/admin/courses">Courses</Link>,
    },
    {
      key: "/admin/branches",
      icon: <ShopOutlined />,
      label: <Link to="/admin/branches">Branches</Link>,
    },
    {
      key: "/admin/teachers",
      icon: <UserSwitchOutlined />,
      label: <Link to="/admin/teachers">Teachers</Link>,
    },
  ];

  return (
    <div style={{ width: collapsed ? 80 : 250, transition: "width 0.1s ease" }}>
      <Menu
        selectedKeys={[location.pathname]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        className="custom-menu"
        style={{
          height: "100vh",
          borderRight: 0,
          background: "linear-gradient(180deg, #001529 0%, #002140 100%)",
        }}
      />
    </div>
  );
};

export default Sidebar;
