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
  { path: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Manager", "Crew"] },
  { path: "/users", label: "Users", icon: User, roles: ["Admin"] },
  { path: "/assets", label: "Assets", icon: Package, roles: ["Admin", "Manager"] },
  { path: "/vulnerabilities", label: "Vulnerabilities", icon: AlertTriangle, roles: ["Admin", "Manager"] },
  { path: "/threats", label: "Threats", icon: ShieldAlert, roles: ["Admin", "Manager"] },
  { path: "/risks", label: "Risks", icon: Target, roles: ["Admin", "Manager"] },
  { path: "/controls", label: "Controls", icon: Shield, roles: ["Admin", "Manager"] },
  { path: "/reports", label: "Reports", icon: FileText, roles: ["Admin", "Manager", "Crew"] },
  { path: "/history", label: "History", icon: History, roles: ["Admin", "Manager", "Crew"] },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = () => {
      // Menggunakan key "richeese_current_user" agar sinkron dengan LoginPage Anda sebelumnya
      const storedUser = localStorage.getItem("richeese_current_user") || localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user data", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
    window.addEventListener("storage", fetchUser);
    return () => window.removeEventListener("storage", fetchUser);
  }, []);

  // --- LOGIKA LOGOUT DIPERBAIKI ---
  const handleLogout = () => {
    const firstConfirm = window.confirm("Apakah Anda yakin ingin keluar dari sistem?");
    
    // Logika hanya berjalan jika user menekan "OK" (true)
    if (firstConfirm) {
      localStorage.removeItem("richeese_current_user");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("login_at");
      setUser(null);
      navigate("/login");
    }
  };

  const filteredNavItems = user 
    ? navItems.filter((item) => item.roles.includes(user.role))
    : [];

  return (
    <aside className="w-64 bg-[#1e3a8a] text-white flex flex-col h-full shadow-xl">
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#1e3a8a]" />
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">Richeese Factory</h1>
            <p className="text-xs text-blue-200">Risk Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.length > 0 ? (
          filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-blue-700 text-white shadow-inner"
                    : "text-blue-100 hover:bg-blue-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="text-xs text-blue-300 italic">No access available</p>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-blue-700 bg-blue-900/20">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-blue-800/30 rounded-xl">
          <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center border border-blue-500/30">
            <User className="w-5 h-5 text-blue-100" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">
              {user?.name || "Unauthenticated"}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-blue-300 truncate">
              {user?.role || "Guest Mode"}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-blue-200 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
