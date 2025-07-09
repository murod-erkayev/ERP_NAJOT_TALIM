import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Students } from "./student";

const StudentLayout = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>🎓 Talabalar ro‘yxati</h1>
        <Button type="link" onClick={() => navigate("/admin")}>
          ⬅️ Boshqaruv paneliga qaytish
        </Button>
      </div>
      <Students/>
      <Outlet />
    </div>
  );
};

export default StudentLayout;
