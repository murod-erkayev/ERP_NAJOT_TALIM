import { Outlet } from "react-router-dom"

export const StudentLayout = () => {
  return (
    <div>
    <h1>Students</h1>
    <Outlet/>
    </div>
  )
}
export default StudentLayout;
