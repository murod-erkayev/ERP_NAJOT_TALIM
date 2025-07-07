import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar" // to'g'ri path bo'lsin
export const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
