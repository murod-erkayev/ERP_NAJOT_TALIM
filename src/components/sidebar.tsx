// components/admin/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { MdGroups} from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
// icon: <MdGroups />
// icon: <FaUsers />
// icon: <FaRegNewspaper /> 
// icon: <FaBoxOpen />
const Sidebar = () => {
  const location = useLocation()
  const links = [
    {to:"/admin/groups", label:"Groups", icon:<MdGroups/>},
    {to:"/admin/students" ,label:"Students", icon:<FaUsers/>},
    {to:"/admin/posts", label:"Posts", icon:<FaRegNewspaper/>},
    {to:"/admin/products", label:"Products", icon:<FaBoxOpen/>}
  ]
  return (
    <aside className="bg-gray-800 text-white min-h-screen w-[240px] p-4">
      <div className="flex flex-col gap-4">
        <h1>Admin Panel</h1>
        {links.map((link)=>(
          <Link 
          key={link.to}
          to={link.to}
          className={`felx items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition 
            ${location.pathname===link.to ? "bg-gray-700":""}`}>
              <span className='text-xl flex'>{link.icon}</span>
              <span >{link.label}</span>
            </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
