import { useState, useEffect } from "react";
import { Search, Bell, Filter } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(2);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome Text */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name || "User"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Richeese Factory Airmadidi - Risk Overview
          </p>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search risks, assets..."
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>

          {/* Notification Icon */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
