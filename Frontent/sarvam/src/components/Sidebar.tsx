import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, School, FileText, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Teachers", path: "/teachers" },
    { icon: School, label: "Classrooms", path: "/classrooms" },
    { icon: FileText, label: "Reports", path: "/reports" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-[240px] h-screen bg-[#F4F1FA] flex flex-col fixed left-0 top-0 rounded-r-3xl">
      {/* Logo */}
      <div className="px-8 pt-10 pb-8">
        <h1 className="text-2xl font-semibold text-indigo-400 tracking-wide">
          SAVRA
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-6">
          MAIN
        </p>

        <ul className="space-y-4">
  {navItems.map((item, index) => (
    <li
      key={item.path}
      className="pb-4 border-b border-indigo-100 last:border-none"
    >
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-full ${
            isActive
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:bg-white/60"
          }`
        }
      >
        <item.icon size={18} strokeWidth={1.6} />
        {item.label}
      </NavLink>
    </li>
  ))}
</ul>
      </nav>

      {/* Admin Profile */}
      <div className="px-6 pb-6 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-semibold text-sm">
            {user ? getInitials(user.name) : "SR"}
          </div>

          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              SCHOOL ADMIN
            </p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {user?.name || "Shauryaman Ray"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
