import { useState, useEffect } from "react";
import { Trash2, UserPlus, Search, Edit, Eye, EyeOff, X } from "lucide-react";
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
  const [users, setUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Manager",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event("storage"));
  }, [users]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    
    return {
      isValid: minLength && hasNumber && hasUpperCase,
      criteria: { minLength, hasNumber, hasUpperCase }
    };
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.toLowerCase().includes("@richeese")) {
      alert("Email tidak valid! Anda harus menggunakan email resmi dengan domain '@richeese'.");
      return;
    }

    const passwordCheck = validatePassword(formData.password);
    if (!passwordCheck.isValid) {
      alert("Password belum memenuhi standar keamanan (Min. 8 karakter, angka, dan huruf besar)!");
      return;
    }

    if (editingUser) {
      const updatedUsers = users.map((u) =>
        u.email === editingUser.email ? { ...formData } : u
      );
      setUsers(updatedUsers);
    } else {
      if (users.find((u) => u.email === formData.email)) {
        alert("Email sudah terdaftar!");
        return;
      }
      setUsers([...users, { ...formData }]);
    }
    
    closeModal();
  };

  const handleDeleteUser = (email: string) => {
    if (window.confirm("Hapus akun ini?")) {
      setUsers(users.filter((u) => u.email !== email));
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData(user);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "Manager" });
    setShowPassword(false);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi Helper untuk menentukan warna Badge berdasarkan Role
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-[#EB1D29] border-red-200"; // Merah (Khas Richeese)
      case "Manager":
        return "bg-amber-100 text-amber-700 border-amber-200"; // Oranye/Amber
      case "Crew":
        return "bg-blue-100 text-blue-700 border-blue-200"; // Biru
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola akses dan akun sistem</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)} 
          className="bg-[#EB1D29] hover:bg-[#c11822] text-white shadow-md transition-all font-bold"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      <Card className="p-4 bg-white border border-gray-200 shadow-sm">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#EB1D29] transition-colors" />
          <input
            type="text"
            placeholder="Search names or emails..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/10 focus:border-[#EB1D29] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold text-center">Role</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.email} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell className="text-center">
                    {/* Badge dengan warna dinamis berdasarkan role */}
                    <Badge variant="outline" className={`font-bold uppercase text-[10px] ${getRoleBadgeStyle(user.role)}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(user)}>
                        <Edit className="w-4 h-4 text-[#EB1D29]" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.email)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingUser ? "Edit Account" : "Create New User"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#EB1D29]"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#EB1D29]"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@richeese.com"
                  required
                />
              </div>
              <div className="relative">
                <label className="text-xs font-bold text-gray-500 block mb-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#EB1D29]"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Security Requirements:</p>
                  <ul className="text-[11px] space-y-0.5">
                    <li className={`flex items-center gap-1.5 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-1 h-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-600' : 'bg-gray-300'}`} />
                      Min. 8 Karakter
                    </li>
                    <li className={`flex items-center gap-1.5 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-1 h-1 rounded-full ${/\d/.test(formData.password) ? 'bg-green-600' : 'bg-gray-300'}`} />
                      Mengandung Angka
                    </li>
                    <li className={`flex items-center gap-1.5 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-300'}`} />
                      Mengandung Huruf Besar
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Role</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#EB1D29] bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Crew">Crew</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6 border-t">
                <Button type="submit" className="flex-1 bg-[#EB1D29] hover:bg-[#c11822] text-white font-bold h-12 shadow-md">
                  {editingUser ? "Update Account" : "Create User"}
                </Button>
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1 h-12">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
