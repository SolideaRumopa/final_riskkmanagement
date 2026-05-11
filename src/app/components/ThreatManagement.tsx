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

const LOCAL_STORAGE_KEY = "richeese_threat_catalog";
const VULN_STORAGE_KEY = "richeese_vulnerabilities";
const CAT_STORAGE_KEY = "richeese_threat_categories";

export function ThreatManagement() {
  const [threats, setThreats] = useState<any[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(CAT_STORAGE_KEY);
    const defaultCats = ["Natural", "Technical", "Human", "Malicious", "Environmental"];
    return saved ? JSON.parse(saved) : defaultCats;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [probabilityFilter, setProbabilityFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingThreat, setEditingThreat] = useState<any>(null);

  const [customCategory, setCustomCategory] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    vulnerabilityIds: [] as string[],
    category: "",
    probability: "",
  });

  useEffect(() => {
    const savedThreats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedThreats) setThreats(JSON.parse(savedThreats));

    const savedVulns = localStorage.getItem(VULN_STORAGE_KEY);
    if (savedVulns) setVulnerabilities(JSON.parse(savedVulns));
  }, [showAddModal]);

  useEffect(() => {
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const handleSave = () => {
    let finalCategory = formData.category;

    if (!formData.name || formData.vulnerabilityIds.length === 0 || !formData.category || !formData.probability) {
      alert("Harap melengkapi semua data dan pilih minimal satu kerentanan.");
      return;
    }

    if (formData.category === "Other") {
      if (!customCategory.trim()) {
        alert("Harap masukkan nama kategori baru.");
        return;
      }
      finalCategory = customCategory.trim();
      if (!categories.includes(finalCategory)) {
        setCategories((prev) => [...prev, finalCategory]);
      }
    }

    let finalId = editingThreat ? editingThreat.id : "";

    if (!editingThreat) {
      let nextNumber = 1;
      if (threats.length > 0) {
        const currentIds = threats.map(t => {
            const parts = t.id?.split("-");
            return parts && parts.length > 1 ? parseInt(parts[1]) : 0;
        });
        nextNumber = Math.max(...currentIds, 0) + 1;
      }
      finalId = `T-${nextNumber.toString().padStart(3, "0")}`;
    }

    const threatData = { ...formData, category: finalCategory, id: finalId };

    let updatedThreats;
    if (editingThreat) {
      updatedThreats = threats.map((t) => t.id === editingThreat.id ? threatData : t);
    } else {
      updatedThreats = [...threats, threatData];
    }

    setThreats(updatedThreats);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedThreats));
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Hapus ancaman ini? Risiko terkait mungkin kehilangan referensi.")) {
      const updated = threats.filter((t) => t.id !== id);
      setThreats(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingThreat(null);
    setIsCustom(false);
    setCustomCategory("");
    setFormData({ name: "", vulnerabilityIds: [], category: "", probability: "" });
  };

  const getVulnerabilityNames = (ids: string[]) => {
    return (ids || []).map(id => {
        const vuln = vulnerabilities.find(v => v.id === id);
        return vuln ? vuln.description : "Unknown Vulnerability";
    });
  };

  const filteredThreats = threats.filter((t) => {
    const vulnNames = getVulnerabilityNames(t.vulnerabilityIds || []);
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vulnNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.id && t.id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesProbability = probabilityFilter === "" || t.probability === probabilityFilter;
    return matchesSearch && matchesProbability;
  });

  const toggleVulnerabilitySelection = (vulnId: string) => {
    setFormData(prev => {
        const isSelected = prev.vulnerabilityIds.includes(vulnId);
        if (isSelected) {
            return { ...prev, vulnerabilityIds: prev.vulnerabilityIds.filter(id => id !== vulnId) };
        } else {
            return { ...prev, vulnerabilityIds: [...prev.vulnerabilityIds, vulnId] };
        }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Threat Management</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar potensi ancaman terhadap aset perusahaan</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-[#EB1D29] text-white shadow-md hover:bg-[#c11822] transition-all">
          <Plus className="w-4 h-4 mr-2" /> Add Threat
        </Button>
      </div>

      <Card className="p-4 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#EB1D29] transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search threats or vulnerabilities..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/10 focus:border-[#EB1D29] outline-none transition-all"
            />
          </div>
          <select
            value={probabilityFilter}
            onChange={(e) => setProbabilityFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer text-sm font-medium text-gray-700"
          >
            <option value="">All Probabilities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Not Relevant">Not Relevant</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-x-auto border-none shadow-sm bg-white">
        <Table className="min-w-max">
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold text-gray-700 w-[80px]">ID</TableHead>
              <TableHead className="font-bold text-gray-700">Name</TableHead>
              <TableHead className="font-bold text-gray-700">Related Vulnerabilities</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">Category</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">Probability</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredThreats.length > 0 ? (
              filteredThreats.map((threat) => (
                <TableRow key={threat.id} className="group hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-bold text-[#EB1D29]">{threat.id}</TableCell>
                  <TableCell className="font-bold text-gray-900">{threat.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                        {getVulnerabilityNames(threat.vulnerabilityIds || []).map((name, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] text-gray-500 bg-gray-50 border-gray-200">
                                {name}
                            </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-semibold text-gray-500 border-gray-200 bg-gray-50">{threat.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`border-0 ${
                        threat.probability === "High" ? "bg-red-50 text-red-700" :
                        threat.probability === "Medium" ? "bg-yellow-50 text-yellow-700" :
                        threat.probability === "Low" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {threat.probability}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingThreat(threat); setFormData(threat); setShowAddModal(true); }}>
                        <Edit className="w-4 h-4 text-[#EB1D29]" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(threat.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center text-gray-400 italic">No threats found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editingThreat ? "Update Threat" : "Add New Threat"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Threat Name</label>
                <input
                  type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Serangan DDoS"
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#EB1D29]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Related Vulnerabilities (Select Multiple)</label>
                <div className="border rounded-lg p-2 max-h-[120px] overflow-y-auto bg-gray-50 space-y-1">
                    {vulnerabilities.length > 0 ? (
                        vulnerabilities.map((v) => (
                            <label key={v.id} className="flex items-center gap-2 px-2 py-1 hover:bg-white rounded cursor-pointer transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={(formData.vulnerabilityIds || []).includes(v.id)}
                                    onChange={() => toggleVulnerabilitySelection(v.id)}
                                    className="accent-[#EB1D29]"
                                />
                                <span className="text-sm text-gray-700 truncate">{v.description}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-xs text-gray-400 p-2 text-center">No vulnerabilities found</p>
                    )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => { setFormData({ ...formData, category: e.target.value }); setIsCustom(e.target.value === "Other"); }}
                  className="w-full px-4 py-2 border rounded-lg outline-none bg-white focus:border-[#EB1D29]"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="Other" className="font-bold text-red-600">+ Create New Category</option>
                </select>
              </div>

              {isCustom && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-red-600 block mb-1 uppercase">New Category Name</label>
                  <input
                    type="text" value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-red-50 rounded-lg outline-none focus:border-[#EB1D29] bg-red-50/20"
                    placeholder="Enter custom category name..."
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Probability</label>
                <div className="flex gap-2">
                  {["Low", "Medium", "High", "Not Relevant"].map((p) => (
                    <button
                      key={p} type="button"
                      onClick={() => setFormData({ ...formData, probability: p })}
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
                <Button onClick={handleSave} className="flex-1 bg-[#EB1D29] text-white font-bold py-6 hover:bg-[#c11822]">
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
