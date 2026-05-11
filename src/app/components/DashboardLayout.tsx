// updated

import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  // --- 1. BACK-END LOGIC & 2. PENYIMPANAN LOKAL ---
  useEffect(() => {
    /**
     * Logika Autentikasi:
     * Mengambil data user dari localStorage. 
     * Jika localStorage kosong, berarti sesi benar-benar tidak ada.
     */
    const checkAuth = () => {
      const userSession = localStorage.getItem("user");
      
      if (!userSession) {
        // Jika tidak ada data user (null), arahkan ke login
        // Menghapus segala bentuk fallback atau initial data dummy
        navigate("/login", { replace: true, state: { from: location } });
      } else {
        // Hanya jika data "user" ditemukan, konten dashboard ditampilkan
        setIsReady(true);
      }
    };

    checkAuth();
    
    // Sinkronisasi status login antar tab
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [navigate, location]);

  // --- 3. FRONT-END INTEGRITY ---
  // Selama isReady false (masih mengecek atau data kosong), tidak ada yang dirender
  if (!isReady) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
