import { useState, useEffect } from "react";
import { Trash2, UserPlus, ShieldCheck, Search } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export const STORAGE_KEY = "system_users";

export function UserManagement() {
  // Logic: Inisialisasi data dari localStorage
  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Crew",
  });

  // Logic: Sinkronisasi ke localStorage setiap kali state users berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Trigger event agar Sidebar/LoginPage tahu ada perubahan data user
    window.dispatchEvent(new Event("storage"));
  }, [users]);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return;

    // Logic: Tambahkan user baru ke array (Backend Logic)
    const newUser = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setShowAddModal(false);
    setFormData({ name: "", email: "", password: "", role: "Crew" });
  };

  const handleDeleteUser = (id: string) => {
    // Logic: Proteksi agar admin sistem tidak terhapus secara tidak sengaja
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.email === "admin@richeese.com") {
      alert("Akun Administrator Utama tidak dapat dihapus!");
      return;
    }

    if (confirm("Hapus akun ini secara permanen?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola kredensial dan hak akses sistem</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-sm"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Account
        </Button>
      </div>

      {/* Stats and Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 border-l-4 border-l-[#1e3a8a] bg-white shadow-sm">
          <div className="p-3 bg-blue-50 rounded-xl text-[#1e3a8a]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 text-center">{users.length}</p>
          </div>
        </Card>
        
        <Card className="p-4 md:col-span-2 flex items-center bg-white shadow-sm">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1e3a8a] focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold text-gray-700">Full Name</TableHead>
              <TableHead className="font-bold text-gray-700">Email</TableHead>
              <TableHead className="font-bold text-gray-700">Role</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={`shadow-none border-none ${
                      user.role === "Manager" || user.role === "Admin" 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-400 italic">
                  Tidak ada pengguna ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modal Section */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Register User</h3>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Nama Lengkap</label>
                <input
                  type="text" required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Email</label>
                <input
                  type="email" required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Password</label>
                <input
                  type="password" required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Role Access</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Manager">Manager</option>
                  <option value="Crew">Crew</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6 border-t">
                <Button type="submit" className="flex-1 bg-[#1e3a8a] text-white font-bold h-12">Create User</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 h-12">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
