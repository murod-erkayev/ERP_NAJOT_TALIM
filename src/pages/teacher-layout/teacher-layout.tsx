import { Button } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Teachers from "./teacher";

export const TeacherLayout = () => {
    const navigate = useNavigate();
  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
        <h1 style={{ margin: 0 }}> Ustozlar</h1>
        <Button type="link" onClick={() => navigate("/admin")}>
          ⬅️ Boshqaruv paneliga qaytish
        </Button>
      </div>
      <Teachers />
      <Outlet />
    </div>
  );
}

export default TeacherLayout;