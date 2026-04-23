import { useState, useEffect } from "react";
import { Trash2, UserPlus, ShieldCheck, Search, Edit, Eye, EyeOff, X } from "lucide-react";
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

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(u => u.email === editingUser.email ? { ...formData } : u));
    } else {
      if (users.find((u) => u.email === formData.email)) {
        alert("Email sudah terdaftar!");
        return;
      }
      setUsers([...users, formData]);
    }
    
    closeModal();
  };

  const handleDelete = (email: string, role: string) => {
    if (role === "Admin") return; // Proteksi admin
    if (window.confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      setUsers(users.filter((u) => u.email !== email));
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData(user);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setShowPassword(false);
    setFormData({ name: "", email: "", password: "", role: "Crew" });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Kelola akses pengguna dan peran sistem</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)} 
          className="bg-[#EB1D29] text-white flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </div>

      <Card className="p-4 border-none shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search names or emails..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus:border-[#EB1D29]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold">Full Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.email}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={
                    user.role === "Admin" ? "bg-purple-100 text-purple-700" :
                    user.role === "Manager" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="w-4 h-4 text-red-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={user.role === "Admin"}
                      onClick={() => handleDelete(user.email, user.role)}
                    >
                      <Trash2 className={`w-4 h-4 ${user.role === "Admin" ? "text-gray-300" : "text-red-500"}`} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {editingUser ? "Edit User Account" : "Create New Account"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Full Name</label>
                <input
                  type="text" required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#EB1D29] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Email</label>
                <input
                  type="email" required
                  disabled={!!editingUser}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#EB1D29] outline-none disabled:bg-gray-100"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@richeese.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} 
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#EB1D29] outline-none pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                     placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Role</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#EB1D29]"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Crew">Crew</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6 border-t">
                <Button type="submit" className="flex-1 bg-[#EB1D29] text-white font-bold h-12">
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
