import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function AssetManagement() {
  const [assets, setAssets] = useState<any[]>(() => {
    const savedAssets = localStorage.getItem("richeese_assets");
    return savedAssets ? JSON.parse(savedAssets) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // State baru untuk melacak mode edit
  const [editingAsset, setEditingAsset] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    value: "",
    category: ""
  });

  useEffect(() => {
    localStorage.setItem("richeese_assets", JSON.stringify(assets));
  }, [assets]);

  // Fungsi untuk membuka modal Edit
  const handleEditClick = (asset: any) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      value: asset.value.toString(), // konversi ke string untuk input number
      category: asset.category
    });
    setShowModal(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value || !formData.category) return;

    if (editingAsset) {
      // LOGIKA UPDATE: Cari ID yang sama dan ganti datanya
      const updatedAssets = assets.map((a) =>
        a.id === editingAsset.id 
          ? { ...a, ...formData, value: Number(formData.value) } 
          : a
      );
      setAssets(updatedAssets);
    } else {
      // LOGIKA CREATE: Buat ID baru
      let nextNumber = 1;
      if (assets.length > 0) {
        const lastAsset = assets[assets.length - 1];
        const lastIdParts = lastAsset.id.split("-");
        nextNumber = lastIdParts.length > 1 ? parseInt(lastIdParts[1]) + 1 : assets.length + 1;
      }
      const nextId = `A-${nextNumber.toString().padStart(3, "0")}`;

      const assetToAdd = {
        id: nextId,
        ...formData,
        value: Number(formData.value),
        status: "Active"
      };
      setAssets([...assets, assetToAdd]);
    }

    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAsset(null);
    setFormData({ name: "", value: "", category: "" });
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus aset ini?")) {
      setAssets(assets.filter((asset: any) => asset.id !== id));
    }
  };

  const filteredAssets = assets.filter((asset: any) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Asset Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola dan perbarui daftar aset organisasi</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 border-none shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus:border-[#1e3a8a]"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold">ID</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Value</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-bold text-[#1e3a8a]">{asset.id}</TableCell>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>Rp {Number(asset.value).toLocaleString("id-ID")}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button 
                      variant="ghost" size="sm" 
                      className="text-gray-500 hover:text-[#1e3a8a]"
                      onClick={() => handleEditClick(asset)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" size="sm" 
                      className="text-red-400 hover:text-red-600"
                      onClick={() => handleDeleteAsset(asset.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAsset ? "Edit Asset" : "Add New Asset"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Asset Name</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#1e3a8a]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Value (Rp)</label>
                <input
                  type="number" required
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#1e3a8a]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Category</label>
                <select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#1e3a8a]"
                >
                  <option value="">Select Category</option>
                  <option value="IT">IT</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#1e3a8a] text-white">
                  {editingAsset ? "Update Asset" : "Confirm"}
                </Button>
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
