import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X } from "lucide-react";
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

// --- KONSTANTA STORAGE ---
const LOCAL_STORAGE_KEY = "richeese_threat_catalog";
const VULN_STORAGE_KEY = "richeese_vulnerabilities";
const CAT_STORAGE_KEY = "richeese_threat_categories";

export function ThreatManagement() {
  const [threats, setThreats] = useState<any[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  
  // State untuk Kategori Dinamis
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(CAT_STORAGE_KEY);
    const defaultCats = ["Natural", "Technical", "Human", "Malicious", "Environmental"];
    return saved ? JSON.parse(saved) : defaultCats;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingThreat, setEditingThreat] = useState<any>(null);
  
  const [customCategory, setCustomCategory] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    vulnerability: "",
    category: "",
    probability: ""
  });

  // Load data dari LocalStorage
  useEffect(() => {
    const savedThreats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedThreats) setThreats(JSON.parse(savedThreats));

    const savedVulns = localStorage.getItem(VULN_STORAGE_KEY);
    if (savedVulns) setVulnerabilities(JSON.parse(savedVulns));
  }, [showAddModal]);

  // Simpan kategori ke LocalStorage jika ada perubahan
  useEffect(() => {
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const handleSave = () => {
    let finalCategory = formData.category;

    // Validasi data lengkap
    if (!formData.name || !formData.vulnerability || !formData.category || !formData.probability) {
      alert("Harap melengkapi semua data terlebih dahulu.");
      return;
    }

    // Jika user membuat kategori baru
    if (formData.category === "Other") {
      if (!customCategory.trim()) {
        alert("Harap masukkan nama kategori baru.");
        return;
      }
      finalCategory = customCategory.trim();
      if (!categories.includes(finalCategory)) {
        setCategories(prev => [...prev, finalCategory]);
      }
    }

    // --- LOGIKA ID OTOMATIS (T-001) ---
    let finalId = editingThreat ? editingThreat.id : "";
    
    if (!editingThreat) {
      let nextNumber = 1;
      if (threats.length > 0) {
        // Mengambil ID terakhir untuk menentukan urutan berikutnya
        const lastThreat = threats[threats.length - 1];
        const lastIdParts = lastThreat.id?.split("-");
        // Jika format ID lama masih timestamp, kita gunakan panjang array + 1
        nextNumber = (lastIdParts && lastIdParts.length > 1) 
          ? parseInt(lastIdParts[1]) + 1 
          : threats.length + 1;
      }
      finalId = `T-${nextNumber.toString().padStart(3, "0")}`;
    }

    const threatData = {
      ...formData,
      category: finalCategory,
      id: finalId
    };

    let updatedThreats;
    if (editingThreat) {
      updatedThreats = threats.map(t => t.id === editingThreat.id ? threatData : t);
    } else {
      updatedThreats = [...threats, threatData];
    }

    setThreats(updatedThreats);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedThreats));
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda ingin menghapus ancaman (threat) ini?")) {
      const updated = threats.filter(t => t.id !== id);
      setThreats(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingThreat(null);
    setIsCustom(false);
    setCustomCategory("");
    setFormData({ name: "", vulnerability: "", category: "", probability: "" });
  };

  const filteredThreats = threats.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vulnerability.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.id && t.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Threat Management</h1>
          <p className="text-sm text-gray-500">Daftar potensi ancaman terhadap aset perusahaan</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-[#EB1D29] text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Threat
        </Button>
      </div>

      <Card className="p-4 border-none shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search threats or related vulnerabilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus:border-[#EB1D29] transition-all"
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold text-xs">ID</TableHead>
              <TableHead className="font-bold text-xs">Name</TableHead>
              <TableHead className="font-bold text-xs">Related Vulnerability</TableHead>
              <TableHead className="font-bold text-xs">Category</TableHead>
              <TableHead className="font-bold text-xs">Probability</TableHead>
              <TableHead className="font-bold text-xs text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredThreats.map((threat) => (
              <TableRow key={threat.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-bold text-[#EB1D29]">{threat.id}</TableCell>
                <TableCell className="font-bold text-gray-900">{threat.name}</TableCell>
                <TableCell className="text-gray-900 text-sm">{threat.vulnerability}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-red-50 text-[#EB1D29] border-red-100">
                    {threat.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={
                    threat.probability === 'High' ? 'bg-red-100 text-red-700' :
                    threat.probability === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }>
                    {threat.probability}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEditingThreat(threat);
                      setFormData(threat);
                      setShowAddModal(true);
                    }}>
                      <Edit className="w-4 h-4 text-[#EB1D29]" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(threat.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editingThreat ? "Update Threat" : "Add New Threat"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Threat Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Hacker"
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#EB1D29]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Related Vulnerability</label>
                <select
                  value={formData.vulnerability}
                  onChange={(e) => setFormData({...formData, vulnerability: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg outline-none bg-white focus:border-[#EB1D29]"
                >
                  <option value="">Select Vulnerability</option>
                  {vulnerabilities.map((v) => (
                    <option key={v.id} value={v.description}>{v.description}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({...formData, category: e.target.value});
                    setIsCustom(e.target.value === "Other");
                  }}
                  className="w-full px-4 py-2 border rounded-lg outline-none bg-white focus:border-[#EB1D29]"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Other" className="font-bold text-red-600">+ Create New Category</option>
                </select>
              </div>

              {isCustom && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-red-600 block mb-1 uppercase">New Category Name</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-red-50 rounded-lg outline-none focus:border-[#EB1D29] bg-red-50/20"
                    placeholder="Enter custom category name..."
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Probability</label>
                <div className="flex gap-2">
                  {["Low", "Medium", "High"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFormData({...formData, probability: p})}
                      className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${
                        formData.probability === p ? "bg-[#EB1D29] text-white border-[#EB1D29]" : "bg-white text-gray-500 border-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t mt-6">
                <Button onClick={handleSave} className="flex-1 bg-[#EB1D29] text-white font-bold py-6">
                  {editingThreat ? "Update Threat" : "Confirm Threat"}
                </Button>
                <Button variant="outline" onClick={closeModal} className="flex-1 py-6 font-bold">Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
