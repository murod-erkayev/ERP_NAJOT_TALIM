// components/admin/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { 
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  ShopOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();

  const items: MenuItem[] = [
    {
      key: '/admin/',
      icon: <TeamOutlined />,
      label: <Link to="/admin/">Groups</Link>,
    },
    {
      key: '/admin/students',
      icon: <UserOutlined />,
      label: <Link to="/admin/students">Students</Link>,
    },
    {
      key: '/admin/posts',
      icon: <FileTextOutlined />,
      label: <Link to="/admin/posts">Posts</Link>,
    },
    {
      key: '/admin/products',
      icon: <ShopOutlined />,
      label: <Link to="/admin/products">Products</Link>,
    },
  ];

  return (
    <div style={{ width: collapsed ? 80 : 256, transition: 'width 0.3s ease' }}>
      <Menu
        selectedKeys={[location.pathname]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        className="custom-menu"
        style={{ 
          height: '100vh', 
          borderRight: 0,
          background: 'linear-gradient(180deg, #001529 0%, #002140 100%)'
        }}
      />
    </div>
  );
};

export default Sidebar;