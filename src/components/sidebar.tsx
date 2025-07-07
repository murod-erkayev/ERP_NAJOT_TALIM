// components/admin/Sidebar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Menu } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  ShopOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true); // Default holatda yig'ilgan bo'lsin
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items: MenuItem[] = [
    {
      key: '/admin/groups',
      icon: <TeamOutlined />,
      label: <Link to="/admin/groups">Groups</Link>,
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
      <div style={{ padding: '16px', background: '#001529' }}>
      {!collapsed && (
          <h2 style={{ 
            color: 'white', 
            margin: 0, 
            textAlign: 'center',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            Admin Panel
          </h2>
        )}
        <Button 
          type="primary" 
          onClick={toggleCollapsed} 
          className="custom-toggle-btn"
          style={{ 
            marginBottom: 16, 
            width: '50%',
            marginLeft:"",
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            height: '40px',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {collapsed ? <MenuUnfoldOutlined style={{ fontSize: '18px' }} /> : <MenuFoldOutlined style={{ fontSize: '18px' }} />}
        </Button>
        
      </div>
      <Menu
        selectedKeys={[location.pathname]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        className="custom-menu"
        style={{ 
          height: 'calc(100vh - 120px)', 
          borderRight: 0,
          background: 'linear-gradient(180deg, #001529 0%, #002140 100%)'
        }}
      />
    </div>
  );
};

export default Sidebar;