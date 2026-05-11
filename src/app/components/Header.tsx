// updated

import { useState, useEffect } from "react";
import { Search, Bell, Filter } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  // --- 1. BACK-END LOGIC & 2. PENYIMPANAN LOKAL ---
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Mengambil data user dari localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        setUser(null);
      }
    }

    // Mengambil jumlah notifikasi dari localStorage
    const savedNotifs = localStorage.getItem("richeese_notif_count");
    // PERBAIKAN: Jika null/kosong, maka default adalah 0 (benar-benar kosong)
    setNotifications(savedNotifs ? parseInt(savedNotifs) : 0);
  }, []);

  // Handler untuk sinkronisasi pencarian
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handler untuk menghapus notifikasi
  const clearNotifications = () => {
    setNotifications(0);
    localStorage.setItem("richeese_notif_count", "0");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome Text */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {/* Jika user null, hanya tampilkan Welcome Back */}
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Richeese Factory Airmadidi
          </p>
        </div>
      </div>
    </header>
  );
}
