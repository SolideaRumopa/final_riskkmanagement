import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
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
const VULN_STORAGE_KEY = "richeese_vulnerabilities"; // Key untuk mengambil data vulnerability

export function ThreatManagement() {
  const [threats, setThreats] = useState<any[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]); // State untuk opsi vulnerability
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingThreat, setEditingThreat] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    vulnerability: "",
    category: "",
    probability: ""
  });

  // Load data dari LocalStorage
  useEffect(() => {
    // Load threats
    const savedThreats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedThreats) setThreats(JSON.parse(savedThreats));

    // Load vulnerabilities untuk dropdown
    const savedVulns = localStorage.getItem(VULN_STORAGE_KEY);
    if (savedVulns) setVulnerabilities(JSON.parse(savedVulns));
  }, [showAddModal]); // Reload data setiap kali modal dibuka

  const saveToLocalStorage = (newThreats: any[]) => {
    setThreats(newThreats);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newThreats));
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) return;

    if (editingThreat) {
      const updated = threats.map(t => 
        t.id === editingThreat.id ? { ...formData, id: t.id } : t
      );
      saveToLocalStorage(updated);
    } else {
      // --- LOGIKA ID URUT (T-001, T-002, dst) ---
      let nextNumber = 1;
      if (threats.length > 0) {
        const lastEntry = threats[threats.length - 1];
        const lastIdParts = lastEntry.id.split("-");
        if (lastIdParts.length > 1) {
          nextNumber = parseInt(lastIdParts[1]) + 1;
        }
      }
      const newId = `T-${nextNumber.toString().padStart(3, "0")}`;
      
      const newThreat = { ...formData, id: newId };
      saveToLocalStorage([...threats, newThreat]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus ancaman ini?")) {
      const filtered = threats.filter(t => t.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const openEditModal = (threat: any) => {
    setEditingThreat(threat);
    setFormData({
      name: threat.name,
      vulnerability: threat.vulnerability,
      category: threat.category,
      probability: threat.probability
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingThreat(null);
    setFormData({ name: "", vulnerability: "", category: "", probability: "" });
  };

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch = threat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || threat.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Threat Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manajemen katalog ancaman potensial dan kerentanan terkait</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Threat
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 bg-gray-50/50 border-dashed border-gray-300">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1e3a8a]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search threats..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition-all"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
          >
            <option value="">All Categories</option>
            <option value="Power">Power</option>
            <option value="Network">Network</option>
            <option value="Human Error">Human Error</option>
            <option value="Security">Security</option>
            <option value="Data Loss">Data Loss</option>
          </select>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[100px] font-bold">ID</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Related Vulnerability</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Probability</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredThreats.length > 0 ? (
              filteredThreats.map((threat) => (
                <TableRow key={threat.id} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell className="font-bold text-[#1e3a8a]">{threat.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{threat.name}</TableCell>
                  <TableCell className="text-gray-600">{threat.vulnerability || "-"}</TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                      {threat.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`shadow-none border-none ${
                      threat.probability === "High" ? "bg-red-100 text-red-700" : 
                      threat.probability === "Medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                    }`}>
                      {threat.probability}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(threat)}><Edit className="w-4 h-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(threat.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="h-32 text-center text-gray-400 italic">No threats found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">
              {editingThreat ? "Update Threat Details" : "Add New Threat"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Threat Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Related Vulnerability (From Storage)</label>
                <select 
                  value={formData.vulnerability}
                  onChange={(e) => setFormData({...formData, vulnerability: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                >
                  <option value="">Select Vulnerability</option>
                  {vulnerabilities.map((v) => (
                    <option key={v.id} value={v.description}>
                      [{v.id}] {v.description.substring(0, 40)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="Power">Power</option>
                  <option value="Network">Network</option>
                  <option value="Human Error">Human Error</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Probability</label>
                <div className="flex gap-2">
                  {["Low", "Medium", "High"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFormData({...formData, probability: p})}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                        formData.probability === p ? "bg-[#1e3a8a] text-white" : "bg-white text-gray-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <Button onClick={handleSave} className="flex-1 bg-blue-600 text-white font-bold py-6">
                  {editingThreat ? "Save Changes" : "Confirm"}
                </Button>
                <Button variant="outline" onClick={closeModal} className="flex-1 py-6">Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
