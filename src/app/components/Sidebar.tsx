import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  Shield,
  FileText,
  History,
  LogOut,
  User,
  ShieldAlert,
  Target,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["Leader", "Floor Manager", "Crew"] },
  { path: "/assets", label: "Asset Management", icon: Package, roles: ["Leader", "Floor Manager"] },
  { path: "/vulnerabilities", label: "Vulnerabilities", icon: AlertTriangle, roles: ["Leader", "Floor Manager"] },
  { path: "/threats", label: "Threat Catalog", icon: ShieldAlert, roles: ["Leader", "Floor Manager"] },
  { path: "/risks", label: "Risk Management", icon: Target, roles: ["Leader", "Floor Manager", "Crew"] },
  { path: "/controls", label: "Control Management", icon: Shield, roles: ["Leader", "Floor Manager"] },
  { path: "/reports", label: "Reports & Export", icon: FileText, roles: ["Leader", "Floor Manager"] },
  { path: "/history", label: "Risk History", icon: History, roles: ["Leader", "Floor Manager"] },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : true
  );

  return (
    <aside className="w-64 bg-[#1e3a8a] text-white flex flex-col">
      {/* Logo and Title */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#1e3a8a]" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Richeese Factory</h1>
            <p className="text-xs text-blue-200">Risk Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-blue-200">{user?.role || "Role"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-100 hover:bg-blue-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
