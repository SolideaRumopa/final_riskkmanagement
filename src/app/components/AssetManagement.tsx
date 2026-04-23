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
  // Load Assets dari LocalStorage
  const [assets, setAssets] = useState<any[]>(() => {
    const savedAssets = localStorage.getItem("richeese_assets");
    return savedAssets ? JSON.parse(savedAssets) : [];
  });

  // Load Categories dari LocalStorage (atau gunakan default jika kosong)
  const [categories, setCategories] = useState<string[]>(() => {
    const savedCats = localStorage.getItem("richeese_asset_categories");
    const defaultCats = ["Information", "Hardware", "Software", "Network", "People", "Process"];
    return savedCats ? JSON.parse(savedCats) : defaultCats;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  
  const [customCategory, setCustomCategory] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    value: "",
    category: "",
    quantity: "1",
    type: "Tangible"
  });

  // Sync Assets & Categories ke LocalStorage
  useEffect(() => {
    localStorage.setItem("richeese_assets", JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("richeese_asset_categories", JSON.stringify(categories));
  }, [categories]);

  const handleEditClick = (asset: any) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      value: asset.value.toString(),
      category: asset.category,
      quantity: asset.quantity ? asset.quantity.toString() : "1",
      type: asset.type || "Tangible"
    });
    setIsCustom(false);
    setShowModal(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalCategory = formData.category;

    // Jika user membuat kategori baru
    if (formData.category === "Other" && customCategory.trim() !== "") {
      finalCategory = customCategory.trim();
      // Tambahkan ke daftar kategori jika belum ada
      if (!categories.includes(finalCategory)) {
        setCategories(prev => [...prev, finalCategory]);
      }
    }

    const qty = Number(formData.quantity);
    if (!formData.name || !formData.value || !finalCategory || qty < 1) {
      alert("Harap isi semua data dengan benar.");
      return;
    }

    const assetData = {
      ...formData,
      category: finalCategory,
      value: Number(formData.value),
      quantity: qty,
    };

    if (editingAsset) {
      const updatedAssets = assets.map((a) =>
        a.id === editingAsset.id ? { ...a, ...assetData } : a
      );
      setAssets(updatedAssets);
    } else {
      let nextNumber = 1;
      if (assets.length > 0) {
        const lastAsset = assets[assets.length - 1];
        const lastIdParts = lastAsset.id.split("-");
        nextNumber = lastIdParts.length > 1 ? parseInt(lastIdParts[1]) + 1 : assets.length + 1;
      }
      const nextId = `A-${nextNumber.toString().padStart(3, "0")}`;

      const assetToAdd = { id: nextId, ...assetData, status: "Active" };
      setAssets([...assets, assetToAdd]);
    }

    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAsset(null);
    setIsCustom(false);
    setCustomCategory("");
    setFormData({ name: "", value: "", category: "", quantity: "1", type: "Tangible" });
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm("Hapus aset ini?")) {
      setAssets(assets.filter((a: any) => a.id !== id));
    }
  };

  const filteredAssets = assets.filter((asset: any) => {
    return asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           asset.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Asset Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar aset organisasi secara sistematis</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-[#EB1D29] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Asset
        </Button>
      </div>

      <Card className="p-4 border-none shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets or categories..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus:border-[#EB1D29]"
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold text-xs">ID</TableHead>
              <TableHead className="font-bold text-xs">Name</TableHead>
              <TableHead className="font-bold text-xs">Category</TableHead>
              <TableHead className="font-bold text-xs">Type</TableHead>
              <TableHead className="font-bold text-xs text-center">Qty</TableHead>
              <TableHead className="font-bold text-xs text-[#EB1D29]">Total Value</TableHead>
              <TableHead className="font-bold text-xs text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-bold text-[#EB1D29]">{asset.id}</TableCell>
                <TableCell className="font-medium text-gray-900">{asset.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                    {asset.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    asset.type === 'Intangible' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {asset.type}
                  </span>
                </TableCell>
                <TableCell className="text-center font-medium">{asset.quantity}</TableCell>
                <TableCell className="font-bold text-[#EB1D29]">
                  Rp {((asset.quantity || 1) * (asset.value || 0)).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(asset)} className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4 text-[#EB1D29]" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAsset(asset.id)} className="h-8 w-8 p-0">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editingAsset ? "Edit Asset" : "Add New Asset"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveAsset} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Name</label>
                <input
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#EB1D29]"
                  placeholder="Laptop"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Quantity</label>
                  <input
                    type="number" required min="1" value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#EB1D29]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Type</label>
                  <select 
                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#EB1D29] bg-white"
                  >
                    <option value="Tangible">Tangible</option>
                    <option value="Intangible">Intangible</option>
                  </select>
                </div>
              </div>

<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="text-xs font-bold text-gray-500 block mb-1">Value</label>
    <div className="relative">
      {/* Simbol Rp di posisi absolute */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
        Rp
      </div>
      <input
        type="number"
        required
        min="0"
        value={formData.value}
        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
        /* PERBAIKAN: Gunakan pl-10 agar angka tidak tertutup teks Rp */
        className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:border-[#EB1D29] transition-all"
        placeholder="10000000"
      />
    </div>
  </div>                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Category</label>
                  <select 
                    required value={formData.category}
                    onChange={(e) => {
                      setFormData({...formData, category: e.target.value});
                      setIsCustom(e.target.value === "Other");
                    }}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#EB1D29] bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other" className="font-bold text-[#EB1D29]">Create New Category</option>
                  </select>
                </div>
              </div>

              {isCustom && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold text-[#EB1D29] block mb-1">New Category Name</label>
                  <input
                    type="text" required value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-[#EB1D29]/30 rounded-lg outline-none focus:border-[#EB1D29] bg-red-50/30"
                    placeholder="Enter custom category..."
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#EB1D29] text-white py-6">
                  {editingAsset ? "Update Asset" : "Confirm Asset"}
                </Button>
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1 py-6">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
