import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Shield, AlertTriangle } from "lucide-react";

const users = [
  { email: "leader@richeese.com", password: "leader123", role: "Leader", name: "Leader Admin" },
  { email: "manager@richeese.com", password: "manager123", role: "Floor Manager", name: "Floor Manager" },
  { email: "crew@richeese.com", password: "crew123", role: "Crew", name: "Crew Member" },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a8a] rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Risk Management System
          </h1>
          <p className="text-sm text-gray-600 mt-2">Richeese Factory Airmadidi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• Leader: leader@richeese.com / leader123</p>
            <p>• Manager: manager@richeese.com / manager123</p>
            <p>• Crew: crew@richeese.com / crew123</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
