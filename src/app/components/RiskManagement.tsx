import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Calculator, AlertCircle, X } from "lucide-react";
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

const STORAGE_KEY = "richeese_risk_management_data";
const ASSET_KEY = "richeese_assets";
const VULN_KEY = "richeese_vulnerabilities";
const THREAT_KEY = "richeese_threat_catalog";
const CAT_KEY = "richeese_risk_categories";

export function RiskManagement() {
  const [risks, setRisks] = useState<any[]>([]);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [availableVulns, setAvailableVulns] = useState<any[]>([]);
  const [availableThreats, setAvailableThreats] = useState<any[]>([]);
  
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(CAT_KEY);
    return saved ? JSON.parse(saved) : ["Operational", "Financial", "Reputational", "Compliance"];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [customCategory, setCustomCategory] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    asset: "",
    vulnerability: "",
    threat: "",
    category: "",
    likelihood: 1,
    impact: 1
  });

  useEffect(() => {
    const savedRisks = localStorage.getItem(STORAGE_KEY);
    if (savedRisks) setRisks(JSON.parse(savedRisks));

    const savedAssets = localStorage.getItem(ASSET_KEY);
    if (savedAssets) setAvailableAssets(JSON.parse(savedAssets));

    const savedVulns = localStorage.getItem(VULN_KEY);
    if (savedVulns) setAvailableVulns(JSON.parse(savedVulns));

    const savedThreats = localStorage.getItem(THREAT_KEY);
    if (savedThreats) setAvailableThreats(JSON.parse(savedThreats));
  }, [showAddModal]);

  useEffect(() => {
    localStorage.setItem(CAT_KEY, JSON.stringify(categories));
  }, [categories]);

  const filteredVulns = availableVulns.filter(v => v.asset === formData.asset);
  const filteredThreats = availableThreats.filter(t => t.vulnerability === formData.vulnerability);

  const persistData = (newData: any[]) => {
    setRisks(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const getRiskLevel = (score: number) => {
    if (score <= 2) return "Low";
    if (score <= 4) return "Medium";
    return "High";
  };

  const handleSave = () => {
    // Validasi Kelengkapan Data
    if (!formData.name || !formData.asset || !formData.vulnerability || !formData.threat || !formData.category) {
      alert("Harap melengkapi semua data (Name, Category, Asset, Vulnerability, Threat) terlebih dahulu sebelum menyimpan assessment.");
      return;
    }

    let finalCategory = formData.category;
    if (formData.category === "Other") {
      if (!customCategory.trim()) {
        alert("Harap isi nama kategori baru Anda.");
        return;
      }
      finalCategory = customCategory.trim();
      if (!categories.includes(finalCategory)) {
        setCategories(prev => [...prev, finalCategory]);
      }
    }

    const score = formData.likelihood * formData.impact;
    const level = getRiskLevel(score);
    const riskData = { ...formData, category: finalCategory, score, level };

    let updatedRisks;
    if (editingId) {
      updatedRisks = risks.map((r) =>
        r.id === editingId ? { ...riskData, id: r.id } : r
      );
    } else {
      let nextNumber = 1;
      if (risks.length > 0) {
        const lastEntry = risks[risks.length - 1];
        const lastIdParts = lastEntry.id.split("-");
        nextNumber = lastIdParts.length > 1 ? parseInt(lastIdParts[1]) + 1 : risks.length + 1;
      }
      const newId = `R-${nextNumber.toString().padStart(3, "0")}`;
      updatedRisks = [...risks, { ...riskData, id: newId }];
    }

    persistData(updatedRisks);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    // Konfirmasi Penghapusan
    if (window.confirm("Apakah Anda ingin menghapus risiko ini?")) {
      persistData(risks.filter((r) => r.id !== id));
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setIsCustom(false);
    setCustomCategory("");
    setFormData({
      name: "", asset: "", vulnerability: "", threat: "",
      category: "", likelihood: 1, impact: 1
    });
  };

  const filteredRisks = risks.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Risk Management</h1>
          <p className="text-sm text-gray-500">Menilai dan memantau risiko organisasi</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-[#EB1D29] hover:bg-[#EB1D29] text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Risk
        </Button>
      </div>

      <Card className="p-4 border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search risks..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#EB1D29]/10 transition-all"
          />
        </div>
      </Card>

      <Card className="overflow-x-auto border-none shadow-sm bg-white">
        <Table className="min-w-max">
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-bold text-gray-700 w-[80px]">ID</TableHead>
              <TableHead className="font-bold text-gray-700">Name</TableHead>
              <TableHead className="font-bold text-gray-700">Asset</TableHead>
              <TableHead className="font-bold text-gray-700">Vulnerability</TableHead>
              <TableHead className="font-bold text-gray-700">Threat</TableHead>
              <TableHead className="font-bold text-gray-700">Category</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">Score</TableHead>
              <TableHead className="font-bold text-gray-700 text-[#EB1D29]">Calculated Value</TableHead>
              <TableHead className="font-bold text-gray-700">Level</TableHead>
              <TableHead className="font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.length > 0 ? (
              filteredRisks.map((risk) => {
                const assetData = availableAssets.find(a => a.name === risk.asset);
                const assetValue = assetData?.value || 0;
                const assetQty = assetData?.quantity || 1;
                const calculatedRisk = (assetValue * assetQty) * risk.likelihood * risk.impact;

                return (
                  <TableRow key={risk.id} className="group hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-bold text-[#EB1D29]">{risk.id}</TableCell>
                    <TableCell className="font-medium text-gray-900">{risk.name}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{risk.asset}</TableCell>
                    <TableCell className="text-gray-600 text-sm max-w-[200px] truncate" title={risk.vulnerability}>
                      {risk.vulnerability}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{risk.threat}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold text-gray-500 border-gray-200">
                        {risk.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-bold text-gray-700">{risk.score}</div>
                      <div className="text-[10px] text-gray-400">{risk.likelihood}L × {risk.impact}I</div>
                    </TableCell>
                    <TableCell className="font-bold text-[#EB1D29] whitespace-nowrap">
                      Rp {calculatedRisk.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Badge className={risk.level === "High" ? "bg-red-50 text-red-700 border-red-100" : risk.level === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-100" : "bg-green-50 text-green-700 border-green-100"}>
                        {risk.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingId(risk.id); setFormData(risk); setShowAddModal(true); }}><Edit className="w-4 h-4 text-[#EB1D29]" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(risk.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 italic">
                    <AlertCircle className="w-12 h-12 mb-3 opacity-10" />
                    <p>No risk assessments found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 shadow-2xl border-none">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">{editingId ? "Update Risk" : "Add New Risk"}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Risk Event Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#EB1D29]" placeholder="Data breach" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Risk Category</label>
                  <select value={formData.category} onChange={(e) => { setFormData({...formData, category: e.target.value}); setIsCustom(e.target.value === "Other"); }} className="w-full px-4 py-2 border rounded-lg outline-none bg-white">
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="Other" className="font-bold text-red-600">+ Add New Category</option>
                  </select>
                </div>
              </div>

              {isCustom && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-red-600 block mb-1">New Category Name</label>
                  <input type="text" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="w-full px-4 py-2 border-2 border-red-100 rounded-lg outline-none focus:border-[#EB1D29] bg-red-50/30" placeholder="Enter category type..." />
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Related Asset</label>
                  <select value={formData.asset} onChange={(e) => setFormData({...formData, asset: e.target.value, vulnerability: "", threat: ""})} className="w-full px-3 py-2 border rounded-lg outline-none bg-white">
                    <option value="">Select Asset</option>
                    {availableAssets.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Related Vulnerability</label>
                  <select disabled={!formData.asset} value={formData.vulnerability} onChange={(e) => setFormData({...formData, vulnerability: e.target.value, threat: ""})} className="w-full px-3 py-2 border rounded-lg outline-none bg-white disabled:bg-gray-50">
                    <option value="">{formData.asset ? "Select Vulnerability" : "Select Asset First"}</option>
                    {filteredVulns.map(v => <option key={v.id} value={v.description}>{v.description.substring(0, 30)}...</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Related Threat</label>
                  <select disabled={!formData.vulnerability} value={formData.threat} onChange={(e) => setFormData({...formData, threat: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none bg-white disabled:bg-gray-50">
                    <option value="">{formData.vulnerability ? "Select Threat" : "Select Vuln First"}</option>
                    {filteredThreats.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-4 font-bold text-gray-700 text-xs"><Calculator className="w-4 h-4 text-[#EB1D29]" /> Risk Level Estimation</div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Likelihood (1-3)</span><span className="text-[#EB1D29]">{formData.likelihood}</span></div>
                    <input type="range" min="1" max="3" step="1" value={formData.likelihood} onChange={(e) => setFormData({...formData, likelihood: Number(e.target.value)})} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EB1D29]" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Impact (1-3)</span><span className="text-[#EB1D29]">{formData.impact}</span></div>
                    <input type="range" min="1" max="3" step="1" value={formData.impact} onChange={(e) => setFormData({...formData, impact: Number(e.target.value)})} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EB1D29]" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-[#EB1D29] hover:bg-[#EB1D29] text-white font-bold h-12 shadow-md">
                  {editingId ? "Update Risk" : "Confirm Risk"}
                </Button>
                <Button variant="outline" className="flex-1 font-bold h-12 border-gray-200 text-gray-500" onClick={handleCloseModal}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
