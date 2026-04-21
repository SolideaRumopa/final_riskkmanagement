import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Shield, AlertTriangle, Eye, EyeOff } from "lucide-react";

const STORAGE_KEY = "system_users";
const HISTORY_KEY = "richeese_risk_history"; // Key yang digunakan RiskHistory

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Logika Backend: Mencatat aktivitas login ke dalam riwayat
  const addLoginLog = (user: any) => {
    try {
      const newEntry = {
        id: `log-${Date.now()}`,
        action: "User Login",
        risk: user.role,
        details: `User ${user.name} (${user.email}) successfully logged into the system.`,
        type: "login",
        user: user.name,
        timestamp: new Date().toISOString(),
      };

      const existingHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      const updatedHistory = [newEntry, ...existingHistory].slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      
      // Pemicu agar komponen lain (seperti RiskHistory) tahu ada data baru
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to update history:", err);
    }
  };

  useEffect(() => {
    const savedUsersRaw = localStorage.getItem(STORAGE_KEY);
    const allUsers = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
    const adminExists = allUsers.find((u: any) => u.email === "admin@richeese.com");
    
    if (!adminExists) {
      const defaultAdmin = {
        id: "admin-static",
        name: "Admin",
        email: "admin@richeese.com",
        password: "adminricheese123",
        role: "Admin",
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...allUsers, defaultAdmin]));
    }

    const session = localStorage.getItem("user");
    if (session) navigate("/", { replace: true });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const savedUsersRaw = localStorage.getItem(STORAGE_KEY);
      const allUsers = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];

      const user = allUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        const { password: _, ...userSession } = user;
        
        // Eksekusi Logika Pencatatan Riwayat
        addLoginLog(user);
        
        localStorage.setItem("user", JSON.stringify(userSession));
        localStorage.setItem("login_at", new Date().toISOString());
        navigate("/", { replace: true });
      } else {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a8a] rounded-lg flex items-center justify-center mb-4 shadow-lg text-white">
            <Shield size={40} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Risk Management</h1>
          <p className="text-sm text-gray-500 mt-2 italic text-center">Richeese Factory Airmadidi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white h-12 font-bold shadow-md transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
